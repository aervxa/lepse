use tauri::{
  menu::{Menu, MenuItem, PredefinedMenuItem},
  tray::{MouseButton, MouseButtonState, TrayIcon, TrayIconBuilder, TrayIconEvent},
  AppHandle, Manager, Result, Runtime,
};
use tauri_plugin_store::StoreExt;

mod commands;

#[cfg(feature = "cef")]
use tauri_runtime_cef::CefRuntime;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  #[cfg(feature = "cef")]
  let builder = tauri::Builder::<CefRuntime<_>>::new();
  #[cfg(not(feature = "cef"))]
  let builder = tauri::Builder::default();

  builder
    .invoke_handler(tauri::generate_handler![commands::get_os])
    .plugin(tauri_plugin_updater::Builder::new().build())
    .plugin(tauri_plugin_opener::init())
    .plugin(tauri_plugin_os::init())
    .plugin(tauri_plugin_process::init())
    .plugin(tauri_plugin_store::Builder::new().build())
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }

      // if nativeDecorations is true, set native decors to true
      if app
        .store("settings.json")
        .ok()
        .and_then(|store| store.get("nativeDecorations"))
        .and_then(|v| v.as_bool())
        .unwrap_or(false)
      {
        let _ = app
          .get_webview_window("main")
          .map(|window| window.set_decorations(true));
      }

      setup_tray(app.app_handle())?;
      Ok(())
    })
    .on_window_event(|window, event| {
      if let tauri::WindowEvent::CloseRequested { api, .. } = event {
        // if minimizeToTray is true, prevent close
        if window
          .app_handle()
          .store("settings.json")
          .ok()
          .and_then(|store| store.get("minimizeToTray"))
          .and_then(|v| v.as_bool())
          .unwrap_or(false)
        {
          let _ = window.hide();
          api.prevent_close();
        } else {
          window.app_handle().exit(0);
        }
      }
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

fn setup_tray<R: Runtime>(app: &AppHandle<R>) -> Result<TrayIcon<R>> {
  Ok(
    TrayIconBuilder::new()
      .icon(app.default_window_icon().unwrap().clone())
      .menu(&Menu::with_items(
        app,
        &[
          &MenuItem::with_id(app, "show", "Show", true, None::<&str>)?,
          &PredefinedMenuItem::separator(app)?,
          &MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?,
        ],
      )?)
      .on_menu_event(|app, event| match event.id.as_ref() {
        "show" => {
          if let Some(window) = app.get_webview_window("main") {
            let _ = window.unminimize();
            let _ = window.show();
            let _ = window.set_focus();
          }
        }
        "quit" => {
          app.exit(0);
        }
        _ => {}
      })
      .on_tray_icon_event(|tray, event| match event {
        TrayIconEvent::Click {
          button: MouseButton::Left,
          button_state: MouseButtonState::Up,
          ..
        } => {
          let app = tray.app_handle();
          if let Some(window) = app.get_webview_window("main") {
            let _ = window.unminimize();
            let _ = window.show();
            let _ = window.set_focus();
          }
        }
        _ => {}
      })
      .build(app)?,
  )
}
