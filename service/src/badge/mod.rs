use std::{
    collections::{HashMap, HashSet},
    sync::{
        atomic::{AtomicUsize, Ordering},
        Arc,
    },
};

use near_primitives::types::AccountId;

use sqlx::types::Uuid;
use tokio::sync::{broadcast, mpsc, Semaphore};

use crate::connections::Connections;

const ACCOUNT_CHANNEL_SIZE: usize = 16;
const MAX_SIMULTANEOUS_WORKERS: usize = 5;

pub type BadgeId = sqlx::types::Uuid;
pub type BadgeCheckerRegistrationId = usize;

#[derive(Clone, Debug)]
pub struct BadgeCheckResult {
    pub account_id: AccountId,
    pub awarded: HashSet<BadgeId>,
    pub checked: &'static HashSet<BadgeId>,
}

pub type BadgeWorker = fn(
    semaphore: Semaphore,
    connections: Connections,
    input: broadcast::Receiver<(AccountId, mpsc::Sender<BadgeCheckResult>)>,
);

pub struct BadgeRegistry {
    connections: Connections,
    registration_to_fn: HashMap<
        BadgeCheckerRegistrationId,
        (
            Arc<Semaphore>,
            broadcast::Sender<(AccountId, mpsc::Sender<BadgeCheckResult>)>,
        ),
    >,
    badge_to_registration: HashMap<BadgeId, BadgeCheckerRegistrationId>,
}

impl BadgeRegistry {
    pub fn new(connections: Connections) -> Self {
        Self {
            connections,
            registration_to_fn: HashMap::new(),
            badge_to_registration: HashMap::new(),
        }
    }

    pub fn register<'a, T>(&mut self, badge_ids: T, start_checker: BadgeWorker)
    where
        T: IntoIterator<Item = &'a Uuid>,
    {
        static REGISTRATION_ID: AtomicUsize = AtomicUsize::new(0);

        let badge_ids: HashSet<_> = badge_ids.into_iter().collect();

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
            self.badge_to_registration
                .insert(*badge_id, registration_id);
        }

        self.registration_to_fn.insert(
            registration_id,
            (Arc::new(Semaphore::new(ACCOUNT_CHANNEL_SIZE)), account_send),
        );

        start_checker(
            Semaphore::new(MAX_SIMULTANEOUS_WORKERS),
            self.connections.clone(),
            account_recv,
        );
    }

    pub async fn queue_account(
        &self,
        account_id: AccountId,
        ignore_badge_ids: HashSet<BadgeId>,
    ) -> HashSet<BadgeId> {
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

        let (result_send, mut result_recv) = mpsc::channel(registration_ids.len());

        for registration_id in registration_ids {
            let (ref semaphore, ref sender) = self.registration_to_fn[registration_id];
            let permit = semaphore.acquire().await.unwrap();
            sender
                .send((account_id.clone(), result_send.clone()))
                .unwrap(); // TODO: Remove unwrap()
            drop(permit);
        }

        drop(result_send);

        let mut result = HashSet::new();

        while let Some(part) = result_recv.recv().await {
            result.extend(part.awarded);
        }

        result
    }
}

#[macro_export]
macro_rules! create_badge_worker {
    ($query_fn: ident) => {
        pub fn run(
            semaphore: tokio::sync::Semaphore,
            connections: $crate::connections::Connections,
            mut input: tokio::sync::broadcast::Receiver<(
                near_primitives::types::AccountId,
                tokio::sync::mpsc::Sender<$crate::badge::BadgeCheckResult>,
            )>,
        ) {
            tokio::spawn(async move {
                let semaphore = std::sync::Arc::new(semaphore);

                while let Ok((account_id, output)) = input.recv().await {
                    let connections = connections.clone();
                    let semaphore = semaphore.clone();

                    tokio::spawn(async move {
                        let permit = semaphore.acquire().await.unwrap();
                        println!("Acquired for {account_id}");
                        let result = $query_fn(connections, account_id.clone()).await;
                        println!("Finished {account_id}");
                        drop(permit);
                        match result {
                            Ok(result) => {
                                output.send(result).await.unwrap(); // TODO: Log instead of unwrap
                            }
                            Err(e) => println!("{e:?}"),
                        }
                    });
                }
            });
        }
    };
}

pub mod transfer;
