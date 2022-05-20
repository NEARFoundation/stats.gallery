use std::{
    collections::{HashMap, HashSet},
    sync::{
        atomic::{AtomicUsize, Ordering},
        Arc,
    },
};

use near_jsonrpc_client::JsonRpcClient;
use near_primitives::types::AccountId;
use sqlx::PgPool;

use tokio::sync::{broadcast, Semaphore};

pub type BadgeId = &'static str;
pub type BadgeCheckerRegistrationId = usize;

#[derive(Clone, Debug)]
pub struct BadgeCheckResult {
    pub account_id: AccountId,
    pub awarded: HashSet<BadgeId>,
    pub checked: HashSet<BadgeId>,
}

pub type BadgeStartFn = fn(
    indexer_pool: &PgPool,
    rpc_client: &JsonRpcClient,
    input: tokio::sync::broadcast::Receiver<AccountId>,
    output: tokio::sync::broadcast::Sender<BadgeCheckResult>,
);

pub struct BadgeRegistry {
    indexer_pool: PgPool,
    rpc_client: JsonRpcClient,
    result_send: broadcast::Sender<BadgeCheckResult>,
    registration_to_fn:
        HashMap<BadgeCheckerRegistrationId, (Arc<Semaphore>, broadcast::Sender<AccountId>)>,
    badge_to_registration: HashMap<BadgeId, BadgeCheckerRegistrationId>,
}

impl BadgeRegistry {
    pub fn new(indexer_pool: PgPool, rpc_client: JsonRpcClient) -> Self {
        let (result_send, _) = tokio::sync::broadcast::channel(32);

        Self {
            indexer_pool,
            rpc_client,
            result_send,
            registration_to_fn: HashMap::new(),
            badge_to_registration: HashMap::new(),
        }
    }

    pub fn subscribe(&self) -> broadcast::Receiver<BadgeCheckResult> {
        self.result_send.subscribe()
    }

    pub fn register(&mut self, badge_ids: &[BadgeId], start_checker: BadgeStartFn) {
        static REGISTRATION_ID: AtomicUsize = AtomicUsize::new(0);

        let badge_ids = badge_ids.iter().collect();

        if !self
            .badge_to_registration
            .keys()
            .collect::<HashSet<_>>()
            .is_disjoint(&badge_ids)
        {
            return;
        }

        let registration_id = REGISTRATION_ID.fetch_add(1, Ordering::Relaxed);
        let (account_send, account_recv) = tokio::sync::broadcast::channel(16);

        for badge_id in badge_ids {
            self.badge_to_registration.insert(badge_id, registration_id);
        }

        self.registration_to_fn.insert(
            registration_id,
            (Arc::new(Semaphore::new(16)), account_send),
        );

        start_checker(
            &self.indexer_pool,
            &self.rpc_client,
            account_recv,
            self.result_send.clone(),
        );
    }

    pub async fn queue_account(&self, account_id: AccountId, ignore_badge_ids: HashSet<BadgeId>) {
        let registration_ids = self
            .badge_to_registration
            .iter()
            .filter_map(|(badge_id, registration_id)| {
                if ignore_badge_ids.contains(badge_id) {
                    None
                } else {
                    Some(registration_id)
                }
            })
            .collect::<HashSet<_>>();

        for registration_id in registration_ids {
            let (ref semaphore, ref sender) = self.registration_to_fn[registration_id];
            let permit = semaphore.acquire().await.unwrap();
            sender.send(account_id.clone()).unwrap(); // TODO: Remove unwrap()
            drop(permit);
        }
    }
}

pub mod transfer;
