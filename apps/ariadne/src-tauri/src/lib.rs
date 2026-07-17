use tauri::{
  image::Image,
  menu::{Menu, MenuItem, PredefinedMenuItem},
  tray::TrayIconBuilder,
  Manager,
};
use tauri_plugin_store::StoreExt;

#[cfg(feature = "cef")]
use tauri_runtime_cef::CefRuntime;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  #[cfg(feature = "cef")]
  let builder = tauri::Builder::<CefRuntime<_>>::new();
  #[cfg(not(feature = "cef"))]
  let builder = tauri::Builder::default();

  builder
    .plugin(tauri_plugin_os::init())
    .plugin(tauri_plugin_store::Builder::new().build())
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }

      // Create tray
      TrayIconBuilder::new()
        .icon(Image::from_path("icons/tray.png")?)
        .menu(&Menu::with_items(
          app,
          &[
            &MenuItem::with_id(app, "show/hide", "Show/Hide", true, None::<&str>)?,
            &PredefinedMenuItem::separator(app)?,
            &MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?,
          ],
        )?)
        .on_menu_event(|app, event| match event.id.as_ref() {
          "show/hide" => {
            if let Some(window) = app.get_webview_window("main") {
              if window.is_visible().unwrap_or(false) {
                let _ = window.close();
              } else {
                let _ = window.unminimize();
                let _ = window.show();
                let _ = window.set_focus();
              }
            }
          }
          "quit" => {
            app.exit(0);
          }
          _ => {}
        })
        .build(app)?;

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
