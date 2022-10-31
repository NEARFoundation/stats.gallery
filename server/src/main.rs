use std::sync::Arc;

use actix_web::{
    get, http::StatusCode, web, App, HttpRequest, HttpResponse, HttpServer, Responder,
};
use dotenv::dotenv;
use indexer::prelude::*;
use local::prelude::*;
use sea_orm::{
    prelude::{Decimal, Uuid},
    sea_query::{Alias, Expr, IntoColumnRef, SimpleExpr},
    ColumnTrait, Condition, Database, DatabaseConnection, EntityTrait, FromQueryResult, JoinType,
    QueryFilter, QueryOrder, QuerySelect,
};
use serde::{Deserialize, Serialize};
use thiserror::Error;

use crate::indexer::sea_orm_active_enums::ReceiptKind;

mod indexer;
mod local;

#[inline]
fn default_port() -> u16 {
    3000
}

#[derive(Deserialize)]
struct Configuration {
    #[serde(default = "default_port")]
    pub port: u16,
    pub database_url: String,
    pub indexer_url: String,
}

#[derive(Serialize)]
struct AppResponse<T: Serialize> {
    pub result: T,
}

#[derive(Serialize, Error, Debug)]
#[serde(tag = "error", rename_all = "snake_case")]
enum AppError {
    #[error("Database query error: {0:?}")]
    Query(
        #[from]
        #[serde(skip)] // Don't expose database errors externallysea_orm::error::DbErr,
        sea_orm::DbErr,
    ),
    #[error("Account not indexed: {account_id}")]
    NotFound { account_id: String },
}

impl actix_web::error::ResponseError for AppError {
    fn status_code(&self) -> StatusCode {
        match self {
            AppError::NotFound { .. } => StatusCode::NOT_FOUND,
            _ => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }

    fn error_response(&self) -> HttpResponse {
        let serialized = serde_json::to_string(self);
        match serialized {
            Ok(serialized) => HttpResponse::build(self.status_code())
                .content_type(mime::APPLICATION_JSON)
                .body(serialized),
            Err(_) => HttpResponse::InternalServerError()
                .content_type(mime::APPLICATION_JSON)
                .body("error"),
        }
    }
}

struct AppState {
    pub local_pool: Arc<DatabaseConnection>,
    pub indexer_pool: Arc<DatabaseConnection>,
}

impl Clone for AppState {
    fn clone(&self) -> Self {
        Self {
            local_pool: Arc::clone(&self.local_pool),
            indexer_pool: Arc::clone(&self.indexer_pool),
        }
    }
}

#[get("/status")]
async fn status() -> impl Responder {
    "ok"
}

#[derive(Deserialize)]
struct TimestampRange {
    pub after_block_timestamp: Option<u64>,
    pub before_block_timestamp: Option<u64>,
}

/// For some reason enums don't work in SeaORM selects unless they're explicitly cast to text.
///
/// This took forever to figure out.
///
/// References:
///  - https://github.com/SeaQL/sea-orm/discussions/843
///  - https://github.com/SeaQL/sea-orm/blob/4301383b409737f85378a1da8a4c122478248ba0/src/query/select.rs#L124-L134
///  - https://www.sea-ql.org/SeaORM/docs/advanced-query/custom-select/#select-custom-expressions
pub fn col_enum<T>(column: T) -> SimpleExpr
where
    T: IntoColumnRef,
{
    Expr::col(column).as_enum(Alias::new("text"))
}

#[get("account/{account_id}/info")]
async fn account_info(
    state: web::Data<AppState>,
    account_id: web::Path<String>,
) -> Result<impl Responder, AppError> {
    use local::*;

    #[derive(FromQueryResult, Serialize, Debug)]
    struct BadgeIdQuery {
        pub badge_id: Uuid,
    }

    let account_id = account_id.into_inner();
    let res = account_badge::Entity::find()
        .column(account_badge::Column::BadgeId)
        .filter(account_badge::Column::AccountId.eq(account_id))
        .into_model::<BadgeIdQuery>()
        .all(&*state.local_pool)
        .await;

    if let Err(ref e) = res {
        println!("{e:?}");
    }

    let res = res?.into_iter().map(|b| b.badge_id).collect::<Vec<_>>();

    Ok(web::Json(res))
}

#[get("account/{account_id}/badges")]
async fn account_badges(
    state: web::Data<AppState>,
    account_id: web::Path<String>,
) -> Result<impl Responder, AppError> {
    use local::*;

    #[derive(FromQueryResult, Serialize, Debug)]
    struct BadgeIdQuery {
        pub badge_id: Uuid,
    }

    let account_id = account_id.into_inner();
    let res = account_badge::Entity::find()
        .column(account_badge::Column::BadgeId)
        .filter(account_badge::Column::AccountId.eq(account_id))
        .into_model::<BadgeIdQuery>()
        .all(&*state.local_pool)
        .await;

    if let Err(ref e) = res {
        println!("{e:?}");
    }

    let res = res?.into_iter().map(|b| b.badge_id).collect::<Vec<_>>();

    Ok(web::Json(res))
}

#[get("account/{account_id}/actions")]
async fn account_actions(
    state: web::Data<AppState>,
    req: HttpRequest,
    account_id: web::Path<String>,
) -> Result<impl Responder, AppError> {
    use indexer::*;

    #[derive(FromQueryResult, Serialize, Debug)]
    struct AccountAction {
        pub receipt_id: String,
        pub index_in_action_receipt: i32,
        pub transaction_hash: String,
        pub action_kind: String,
        pub block_hash: String,
        pub block_timestamp: Decimal,
        pub predecessor_account_id: String,
        pub receiver_account_id: String,
    }

    let account_id = account_id.into_inner();
    let range = web::Query::<TimestampRange>::from_query(req.query_string()).unwrap(); // Should always be safe because req.query_string() should never return an invalid query string

    let condition = Condition::all()
        .add(receipts::Column::ReceiptKind.eq(ReceiptKind::Action))
        .add(
            Condition::any()
                .add(receipts::Column::PredecessorAccountId.eq(account_id.clone()))
                .add(receipts::Column::ReceiverAccountId.eq(account_id.clone())),
        )
        .add_option(
            range
                .after_block_timestamp
                .map(|after| receipts::Column::IncludedInBlockTimestamp.gte(after)),
        )
        .add_option(
            range
                .before_block_timestamp
                .map(|before| receipts::Column::IncludedInBlockTimestamp.lt(before)),
        );

    let res = Receipts::find()
        .column_as(
            receipts::Column::OriginatedFromTransactionHash,
            "transaction_hash",
        )
        .column_as(receipts::Column::IncludedInBlockHash, "block_hash")
        .column_as(
            receipts::Column::IncludedInBlockTimestamp,
            "block_timestamp",
        )
        .column(action_receipt_actions::Column::IndexInActionReceipt)
        .column_as(
            col_enum(action_receipt_actions::Column::ActionKind),
            "action_kind",
        )
        .filter(condition)
        .join_rev(
            JoinType::LeftJoin,
            action_receipt_actions::Entity::belongs_to(receipts::Entity)
                .from(action_receipt_actions::Column::ReceiptId)
                .to(receipts::Column::ReceiptId)
                .into(),
        )
        .order_by_desc(receipts::Column::IncludedInBlockTimestamp)
        .limit(2000)
        .into_model::<AccountAction>()
        .all(&*state.indexer_pool)
        .await;

    if let Err(ref e) = res {
        println!("{e:?}");
    }

    let res = res?;

    Ok(web::Json(res))
}

#[get("account/{account_id}/score")]
async fn account_score(
    state: web::Data<AppState>,
    account_id: web::Path<String>,
) -> Result<impl Responder, AppError> {
    let account_id = account_id.into_inner();
    let res = Account::find_by_id(account_id.clone())
        .one(&*state.local_pool)
        .await?;

    if let Some(res) = res {
        Ok(web::Json(AppResponse { result: res.score }))
    } else {
        Err(AppError::NotFound { account_id })
    }
}

#[actix_web::main]
async fn main() -> std::result::Result<(), Box<dyn std::error::Error>> {
    dotenv().ok();

    let config = envy::from_env::<Configuration>().unwrap();

    let local_pool = Database::connect(&config.database_url).await?;
    let indexer_pool = Database::connect(&config.indexer_url).await?;

    let state = AppState {
        local_pool: Arc::new(local_pool),
        indexer_pool: Arc::new(indexer_pool),
    };

    Ok(HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(state.clone()))
            .service(status)
            .service(account_score)
            .service(account_actions)
            .service(account_badges)
    })
    .bind(("127.0.0.1", config.port))?
    .run()
    .await?)
}
