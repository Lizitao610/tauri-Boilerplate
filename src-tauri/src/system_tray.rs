use std::collections::HashMap;

use crate::quit_app;
use crate::utils::common::get_system_language;
use crate::window::set_main_window_visible;
use tauri::{
    Builder, CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem, Wry,
};

fn get_tray_titles_by_lang() -> HashMap<&'static str, &'static str> {
    let mut titles = HashMap::new();

    if let Some(lang) = get_system_language() {
        println!("System language is: {}", lang);
        match lang.as_str() {
            _ if lang.contains("Hans") || lang == "zh-CN" => {
                titles.insert("quit", "退出");
                titles.insert("open_main_window", "打开 MultipleSearch");

                return titles;
            }
            _ => {}
        }
    }

    titles.insert("quit", "Quit");
    titles.insert("open_main_window", "Open MultipleSearch");

    titles
}

pub fn gen_system_tray() -> SystemTray {
    let titles = get_tray_titles_by_lang();

    let quit = CustomMenuItem::new(
        "quit".to_string(),
        (*titles.get("quit").unwrap_or(&"")).to_string(),
    );

    let open_main_window = CustomMenuItem::new(
        "open_main_window".to_string(),
        (*titles.get("open_main_window").unwrap_or(&"")).to_string(),
    );

    let tray_menu = SystemTrayMenu::new()
        .add_item(open_main_window)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);

    let system_tray = SystemTray::new().with_menu(tray_menu);

    return system_tray;
}

pub fn add_system_tray(builder: Builder<Wry>) -> Builder<Wry> {
    let system_tray = gen_system_tray();

    let builder = builder
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "quit" => {
                    quit_app();
                }
                "open_main_window" => {
                    set_main_window_visible(app.clone(), true)
                        .unwrap_or_else(|e| println!("Failed to open main window: {}", e));
                }
                _ => {}
            },
            _ => {}
        });

    return builder;
}
