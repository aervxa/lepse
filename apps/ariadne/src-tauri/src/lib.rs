#[cfg(target_os = "linux")]
use tauri_runtime_cef::CefRuntime;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  #[cfg(target_os = "linux")]
  let builder = tauri::Builder::<CefRuntime<_>>::new();
  #[cfg(not(target_os = "linux"))]
  let builder = tauri::Builder::default();

  builder
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
