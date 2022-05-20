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

const RESULT_CHANNEL_SIZE: usize = 32;
const ACCOUNT_CHANNEL_SIZE: usize = 16;
const MAX_SIMULTANEOUS_WORKERS: usize = 5;

pub type BadgeId = &'static str;
pub type BadgeCheckerRegistrationId = usize;

#[derive(Clone, Debug)]
pub struct BadgeCheckResult {
    pub account_id: AccountId,
    pub awarded: HashSet<BadgeId>,
    pub checked: HashSet<BadgeId>,
}

pub struct Connections {
    pub indexer_pool: PgPool,
    pub rpc_client: JsonRpcClient,
}

pub type BadgeStartFn = fn(
    semaphore: Semaphore,
    connections: &Connections,
    input: broadcast::Receiver<AccountId>,
    output: broadcast::Sender<BadgeCheckResult>,
);

pub struct BadgeRegistry {
    connections: Connections,
    result_send: broadcast::Sender<BadgeCheckResult>,
    registration_to_fn:
        HashMap<BadgeCheckerRegistrationId, (Arc<Semaphore>, broadcast::Sender<AccountId>)>,
    badge_to_registration: HashMap<BadgeId, BadgeCheckerRegistrationId>,
}

impl BadgeRegistry {
    pub fn new(connections: Connections) -> Self {
        let (result_send, _) = broadcast::channel(RESULT_CHANNEL_SIZE);

        Self {
            connections,
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
        let (account_send, account_recv) = broadcast::channel(ACCOUNT_CHANNEL_SIZE);

        for badge_id in badge_ids {
            self.badge_to_registration.insert(badge_id, registration_id);
        }

        self.registration_to_fn.insert(
            registration_id,
            (Arc::new(Semaphore::new(ACCOUNT_CHANNEL_SIZE)), account_send),
        );

        start_checker(
            Semaphore::new(MAX_SIMULTANEOUS_WORKERS),
            &self.connections,
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
