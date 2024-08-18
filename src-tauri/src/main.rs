// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod error;
mod system_tray;
mod utils;
mod window;

use tauri::{self, Manager};
use tauri_plugin_autostart::MacosLauncher;

#[tauri::command]
fn quit_app() {
    std::process::exit(0);
}

#[derive(Clone, serde::Serialize)]
struct Payload {
    args: Vec<String>,
    cwd: String,
}

fn main() {
    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_positioner::init())
        .plugin(tauri_plugin_fs_watch::init())
        .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
            println!("{}, {argv:?}, {cwd}", app.package_info().name);
            app.emit_all("single-instance", Payload { args: argv, cwd })
                .unwrap();
        }))
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec!["--flag1", "--flag2"]), /* arbitrary number of args to pass to your app */
        ))
        .setup(setup_handler)
        .invoke_handler(tauri::generate_handler![
            utils::common::open,
            utils::common::fetch_url_metadata,
            utils::common::fetch_url_favicon,
            utils::common::filter_files,
            quit_app,
            window::set_main_window_visible,
            utils::clipboard::copy_image,
        ]);

    let builder = system_tray::add_system_tray(builder);

    builder
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn setup_handler(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error + 'static>> {
    let app_handle = app.handle();
    let app_data_dir = app_handle.path_resolver().app_data_dir().unwrap();
    println!("app_data_dir {}", app_data_dir.to_string_lossy());

    // 隐藏Macos上的Docker icon
    // app.set_activation_policy(tauri::ActivationPolicy::Accessory);

    window::open_main_window(&app_handle, None)?;

    Ok(())
}
