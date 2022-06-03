use actix_web::{get, App, HttpServer, Responder};
use dotenv::dotenv;
use serde::Deserialize;

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

#[get("/status")]
async fn status() -> impl Responder {
    "ok"
}

#[tokio::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    let config = envy::from_env::<Configuration>().unwrap();

    HttpServer::new(|| App::new().service(status))
        .bind(("127.0.0.1", config.port))?
        .run()
        .await
}
