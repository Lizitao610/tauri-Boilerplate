use anyhow::anyhow;
use anyhow::Result;
use blake3::Hasher;
use favicon_picker::get_favicons_from_url;
use meta_fetcher::fetch_metadata;
use reqwest::header::{HeaderMap, HeaderValue, USER_AGENT};
use reqwest::Client;
use serde::Deserialize;
use serde::Serialize;
use std::fs;
use std::fs::Metadata;
use std::{
    fs::File,
    io::{self, Read},
    path::{Path, PathBuf},
    process::Command,
    time::{SystemTime, UNIX_EPOCH},
};
use tauri::AppHandle;
use tauri::Url;

#[tauri::command]
pub async fn open(path: &str) -> Result<(), String> {
    opener::open(path).map_err(|e| e.to_string())
}

#[cfg(target_os = "macos")]
pub fn get_system_language() -> Option<String> {
    let output = Command::new("defaults")
        .arg("read")
        .arg("-g")
        .arg("AppleLanguages")
        .output()
        .expect("Failed to execute command");

    if output.status.success() {
        let lang = String::from_utf8(output.stdout).unwrap();
        Some(
            lang.trim()
                .replace("(", "")
                .replace(")", "")
                .replace("\"", "")
                .replace(" ", "")
                .replace("\n", ""),
        )
    } else {
        None
    }
}

#[cfg(target_os = "windows")]
pub fn get_system_language() -> Option<String> {
    let mut buffer: [u16; 255] = [0; 255];
    unsafe {
        GetUserDefaultLocaleName(buffer.as_mut_ptr(), buffer.len() as i32);
    }
    let lang = String::from_utf16_lossy(&buffer);
    let lang = lang.trim_end_matches('\0');
    Some(lang.to_string())
}

pub fn hash_data<T: AsRef<[u8]>>(t: T) -> String {
    let mut hasher = Hasher::new();
    hasher.update(t.as_ref());
    let hash = hasher.finalize();

    hash.to_hex().to_string()
}

pub fn hash_file(path: &str) -> io::Result<blake3::Hash> {
    let mut hasher = Hasher::new();
    let mut file = File::open(path)?;
    let mut buffer = [0; 1024];

    while let Ok(n) = file.read(&mut buffer) {
        if n == 0 {
            break;
        }
        hasher.update(&buffer[..n]);
    }

    Ok(hasher.finalize())
}

pub fn systemtime_to_timestamp(system_time: SystemTime) -> anyhow::Result<u128> {
    let unix_epoch = UNIX_EPOCH;

    // Get the duration since UNIX epoch
    let duration = system_time
        .duration_since(unix_epoch)
        .map_err(|e| anyhow!("Failed to calculate duration: {}", e))?;

    let seconds = duration.as_millis();

    Ok(seconds)
}

pub fn file_update_time(path: &PathBuf) -> anyhow::Result<u128> {
    let file_metadata: Metadata = fs::metadata(path)?;

    let updated_at = systemtime_to_timestamp(file_metadata.modified()?)?;

    Ok(updated_at)
}

pub fn file_create_time(path: &PathBuf) -> anyhow::Result<u128> {
    let file_metadata: Metadata = fs::metadata(path)?;

    let updated_at = systemtime_to_timestamp(file_metadata.created()?)?;

    Ok(updated_at)
}

pub fn get_app_data_dir(app_handle: &AppHandle) -> Result<std::path::PathBuf, anyhow::Error> {
    let app_data_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .unwrap_or(std::path::PathBuf::new());

    Ok(app_data_dir)
}

use crate::error::SerializedError;

#[derive(Serialize, Deserialize)]
pub struct UrlMetadata {
    pub title: Option<String>,
    pub description: Option<String>,
    pub image: Option<String>,
}

pub async fn _fetch_url_favicon(url: &str) -> Result<String, anyhow::Error> {
    let client = Client::builder()
        .default_headers({
            let mut headers = HeaderMap::new();
            headers.append(USER_AGENT, HeaderValue::from_str("favicon-picker/1.0.0")?);
            headers
        })
        .build()?;

    let base_url = Url::parse(url)?;
    let favicons = get_favicons_from_url(&client, &base_url)
        .await
        .map_err(|e| anyhow::Error::msg(e.to_string()))?;

    Ok(favicons[0].href.to_string())
}

#[tauri::command]
pub async fn fetch_url_favicon(url: &str) -> Result<String, String> {
    _fetch_url_favicon(url).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn fetch_url_metadata(url: &str) -> Result<UrlMetadata, SerializedError> {
    let metadata = fetch_metadata(url).map_err(|e| {
        println!("error: {:?}", e);
        anyhow::Error::msg(e.to_string())
    })?;
    return Ok(UrlMetadata {
        title: metadata.title,
        description: metadata.description,
        image: metadata.image,
    });
}

#[tauri::command]
pub async fn filter_files(paths: Vec<String>) -> Result<Vec<String>, SerializedError> {
    let filtered_files = paths
        .iter()
        .filter(|path| Path::new(path).is_file())
        .map(|path| path.to_string())
        .collect();

    Ok(filtered_files)
}
