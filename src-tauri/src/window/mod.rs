use anyhow::Result;
use tauri::Manager;
#[cfg(target_os = "macos")]
use tauri::TitleBarStyle;

#[cfg(target_os = "windows")]
use window_shadows::set_shadow;

fn set_window_visible(app: &tauri::AppHandle, label: &str, visible: bool) -> Result<()> {
    if let Some(window) = app.get_window(label) {
        if visible {
            if window.is_minimized()? {
                window.unminimize()?;
            } else if !window.is_visible()? {
                window.show()?;
            }
            window.set_focus()?;
            window.emit("window_visible", {})?;
        } else {
            if window.is_visible()? {
                window.hide()?;
            }
        }
    }
    Ok(())
}

#[tauri::command]
pub fn set_main_window_visible(app: tauri::AppHandle, visible: bool) -> Result<(), String> {
    set_window_visible(&app, "main", visible).map_err(|e| e.to_string())
}

pub fn open_main_window(app: &tauri::AppHandle, default_path: Option<String>) -> Result<()> {
    let path = match default_path {
        Some(path) => path,
        None => "/".to_owned(),
    };
    if let None = app.get_window("main") {
        let window = tauri::WindowBuilder::new(app, "main", tauri::WindowUrl::App(path.into()))
            .inner_size(960.0, 600.0)
            .min_inner_size(960.0, 600.0)
            .accept_first_mouse(true);

        #[cfg(target_os = "macos")]
        {
            window
                .hidden_title(true)
                .title_bar_style(TitleBarStyle::Overlay)
                .build()?;
        }

        #[cfg(target_os = "windows")]
        let w = window
            .title("")
            .decorations(false)
            .transparent(true)
            .build()?;

        #[cfg(target_os = "windows")]
        set_shadow(&w, true).unwrap_or_else(|_| ());
    }
    Ok(())
}
