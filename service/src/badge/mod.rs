use std::{
    collections::{HashMap, HashSet},
    pin::Pin,
    sync::{atomic::{AtomicUsize, Ordering}, Arc},
};

use async_trait::async_trait;
use futures::Future;

use near_jsonrpc_client::JsonRpcClient;
use near_primitives::types::AccountId;
use sqlx::PgPool;

use tokio::sync::{
    broadcast,
    mpsc::{Receiver, Sender}, Semaphore,
};

pub type BadgeId = &'static str;
pub type BadgeCheckerRegistrationId = usize;

#[derive(Clone, Debug)]
pub struct BadgeCheckResult {
    pub account_id: AccountId,
    pub awarded: HashSet<BadgeId>,
    pub checked: HashSet<BadgeId>,
}

pub type BadgeChecker =
    fn(
        indexer_pool: &PgPool,
        rpc_client: &JsonRpcClient,
        account_id: &AccountId,
    ) -> Pin<Box<dyn Future<Output = Result<BadgeCheckResult, Box<dyn std::error::Error>>>>>;

pub trait BadgeStart {
    fn run(
        &self,
        indexer_pool: &PgPool,
        rpc_client: &JsonRpcClient,
        input: tokio::sync::broadcast::Receiver<AccountId>,
        output: tokio::sync::broadcast::Sender<BadgeCheckResult>,
    );
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
    registration_to_fn: HashMap<BadgeCheckerRegistrationId, (Arc<Semaphore>, broadcast::Sender<AccountId>)>,
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

        self.registration_to_fn
            .insert(registration_id, (Arc::new(Semaphore::new(16)), account_send));

        start_checker(
            &self.indexer_pool,
            &self.rpc_client,
            account_recv,
            self.result_send.clone(),
        );
    }

    pub async fn queue_account(
        &self,
        account_id: AccountId,
        ignore_badge_ids: HashSet<BadgeId>,
    ) {
        let registration_ids = self.badge_to_registration.iter().filter_map(|(badge_id, registration_id)|{
            if ignore_badge_ids.contains(badge_id) {
                None
            } else {
                Some(registration_id)
            }
        }).collect::<HashSet<_>>();

        for registration_id in registration_ids {
            let (ref semaphore, ref sender) = self.registration_to_fn[registration_id];
            let permit = semaphore.acquire().await.unwrap();
            sender.send(account_id.clone()).unwrap(); // TODO: Remove unwrap()
            drop(permit);
        }
    }

    // pub async fn check_account(
    //     &self,
    //     account_id: &AccountId,
    //     indexer_pool: &PgPool,
    //     rpc_client: &JsonRpcClient,
    //     ignore_badge_ids: &HashSet<BadgeId>,
    // ) -> BadgeCheckResult {
    //     let mut ignore_badge_ids = ignore_badge_ids.clone();
    //     let mut awarded = HashSet::<BadgeId>::new();
    //     let mut checked = HashSet::<BadgeId>::new();

    //     for badge_id in self.registry.keys() {
    //         if ignore_badge_ids.contains(badge_id) {
    //             continue;
    //         }

    //         let checker = self.registry[badge_id];
    //         let result = checker(indexer_pool, rpc_client, account_id).await;
    //         if let Ok(result) = result {
    //             awarded.extend(result.awarded);
    //             checked.extend(&result.checked);
    //             ignore_badge_ids.extend(result.checked);
    //         } // TODO: Err case
    //     }

    //     BadgeCheckResult { awarded, checked }
    // }
}

// pub fn badges() -> Vec<Box<dyn Badge>> {
//     vec![Box::new(Transfer)]
// }

#[async_trait]
pub trait Badge {
    fn badge_ids() -> &'static [&'static str];
    async fn check_account(
        indexer_pool: &PgPool,
        rpc_client: &JsonRpcClient,
        account_id: &AccountId,
    ) -> Vec<&'static str>;
}

pub struct BadgeStruct<'a, 'b, Fut, E>
where
    Fut: Future<Output = Result<BadgeCheckResult, E>> + Send + Sync,
    E: std::error::Error,
    'b: 'a,
{
    pub badges: HashSet<BadgeId>,
    pub checker:
        Box<dyn 'a + Send + Sync + Fn(&'b PgPool, &'b JsonRpcClient, &'b AccountId) -> Fut>,
}

#[async_trait]
pub trait BadgeTrait<'b> {
    async fn check(
        &'b self,
        indexer_pool: &'b PgPool,
        rpc_client: &'b JsonRpcClient,
        account_id: &'b AccountId,
    ) -> Result<BadgeCheckResult, Box<dyn std::error::Error>>;
}

// impl BadgeTrait for String {
//     fn check<'life0, 'life1, 'life2, 'life3, 'async_trait>(
//         &'life0 self,
//         indexer_pool: &'life1 PgPool,
//         rpc_client: &'life2 JsonRpcClient,
//         account_id: &'life3 AccountId,
//     ) -> core::pin::Pin<
//         Box<
//             dyn core::future::Future<Output = Result<BadgeCheckResult, Box<dyn std::error::Error>>>
//                 + core::marker::Send
//                 + 'async_trait,
//         >,
//     >
//     where
//         'life0: 'async_trait,
//         'life1: 'async_trait,
//         'life2: 'async_trait,
//         'life3: 'async_trait,
//         Self: 'async_trait,
//     {
//         todo!()
//     }
// }

#[async_trait]
impl<Fut, E, 'a, 'b> BadgeTrait<'b> for BadgeStruct<'a, 'b, Fut, E>
where
    Fut: Future<Output = Result<BadgeCheckResult, E>> + Send + Sync,
    E: std::error::Error + 'static,
    'b: 'a,
{
    async fn check(
        &'b self,
        indexer_pool: &'b PgPool,
        rpc_client: &'b JsonRpcClient,
        account_id: &'b AccountId,
    ) -> Result<BadgeCheckResult, Box<dyn std::error::Error>> {
        (self.checker)(indexer_pool, rpc_client, account_id)
            .await
            .map_err(|e| Box::new(e) as Box<dyn std::error::Error>)
    }
}

pub mod transfer;
