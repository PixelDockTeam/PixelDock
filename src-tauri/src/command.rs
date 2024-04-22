use serde::{Deserialize, Serialize};
use sqlx::FromRow;

use crate::db::DB_URL;

#[derive(Debug, FromRow, Deserialize, Serialize)]
pub struct Task {
    pub id: i64,
    pub value: String,
    pub completed: i8,
    pub date_completed: String,
    pub project_id: i64,
}

#[derive(Debug, FromRow, Deserialize, Serialize)]
pub struct Game {
    pub id: i64,
    pub name: String,
    pub path: String,
    pub coverID: String,
    pub gameID: String,
}

#[tauri::command(rename_all = "snake_case")]
pub async fn get_tasks() -> Result<Vec<Task>, String> {
    let url = DB_URL;

    let pool = sqlx::sqlite::SqlitePool::connect(url)
        .await
        .expect("unable to connect"); //lIKE A CONNECTION IN OTHER LANGS

    let sql = "SELECT * FROM tasks"; //QUERY

    let query = sqlx::query_as::<_, Task>(sql);

    let response = query.fetch_all(&pool).await.expect("unable to list tasks");

    pool.close().await;

    Ok(response)
}

#[tauri::command(rename_all = "snake_case")]
pub async fn get_games() -> Result<Vec<Game>, String> {
    let url = DB_URL;
    let pool = sqlx::sqlite::SqlitePool::connect(url)
        .await
        .expect("unable to connect"); //lIKE A CONNECTION IN OTHER LANGS

    let sql = "SELECT * FROM games"; //QUERY

    let query = sqlx::query_as::<_, Game>(sql);

    let response = query.fetch_all(&pool).await.expect("unable to list tasks");

    pool.close().await;

    Ok(response)
}

#[tauri::command(rename_all = "snake_case")]
pub async fn insert_game(game: Game) {
    let pool = sqlx::sqlite::SqlitePool::connect(DB_URL)
        .await
        .expect("unable to connect");
    let sql = "
        INSERT INTO games (name, path, coverID, gameID)
        VALUES            (?,   ?,   ?,      ?);
    ";

    let query = sqlx::query(&sql)
        .bind(game.name)
        .bind(game.path)
        .bind(game.coverID)
        .bind(game.gameID);
    let result = query.execute(&pool).await.unwrap();
    println!("Create Records result: {:?}", result);
    pool.close().await;
}

#[tauri::command(rename_all = "snake_case")]
pub async fn get_game(game_id: String) -> Result<Vec<Game>, String> {
    let url = DB_URL;
    let pool = sqlx::sqlite::SqlitePool::connect(url)
        .await
        .expect("unable to connect"); //lIKE A CONNECTION IN OTHER LANGS

    let sql = "SELECT * FROM games WHERE gameID = ?"; //QUERY

    let query = sqlx::query_as::<_, Game>(sql).bind(game_id);
    let response = query.fetch_all(&pool).await.expect("unable to list tasks");
    pool.close().await;
    Ok(response)
}
