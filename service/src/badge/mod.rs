use std::{
    collections::{HashMap, HashSet},
    pin::Pin,
};

use async_trait::async_trait;
use futures::{Future, future::BoxFuture};
use lazy_static::lazy_static;
use near_jsonrpc_client::JsonRpcClient;
use near_primitives::types::AccountId;
use sqlx::PgPool;

use self::transfer::Transfer;

pub type BadgeId = &'static str;

#[derive(Clone)]
pub struct BadgeCheckResult {
    pub awarded: HashSet<BadgeId>,
    pub checked: HashSet<BadgeId>,
}

pub type BadgeChecker =
    fn(
        indexer_pool: &PgPool,
        rpc_client: &JsonRpcClient,
        account_id: &AccountId,
    ) -> Pin<Box<dyn Future<Output = Result<BadgeCheckResult, Box<dyn std::error::Error>>>>>;

pub struct BadgeRegistry {
    registry: HashMap<BadgeId, BadgeChecker>,
}

impl BadgeRegistry {
    pub fn new() -> Self {
        Self {
            registry: HashMap::new(),
        }
    }

    pub fn register(&mut self, badge_id: BadgeId, checker: BadgeChecker) {
        if self.registry.contains_key(&badge_id) {
            return;
        }

        self.registry.insert(badge_id, checker);
    }

    pub async fn check_account(
        &self,
        account_id: &AccountId,
        indexer_pool: &PgPool,
        rpc_client: &JsonRpcClient,
        ignore_badge_ids: &HashSet<BadgeId>,
    ) -> BadgeCheckResult {
        let mut ignore_badge_ids = ignore_badge_ids.clone();
        let mut awarded = HashSet::<BadgeId>::new();
        let mut checked = HashSet::<BadgeId>::new();

        for badge_id in self.registry.keys() {
            if ignore_badge_ids.contains(badge_id) {
                continue;
            }

            let checker = self.registry[badge_id];
            let result = checker(indexer_pool, rpc_client, account_id).await;
            if let Ok(result) = result {
                awarded.extend(result.awarded);
                checked.extend(&result.checked);
                ignore_badge_ids.extend(result.checked);
            } // TODO: Err case
        }

        BadgeCheckResult { awarded, checked }
    }
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
