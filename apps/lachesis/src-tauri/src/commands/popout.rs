use tauri::{
  window::{Effect, EffectsBuilder},
  AppHandle, Emitter, EventTarget, Manager, WebviewUrl, WebviewWindowBuilder,
};

#[tauri::command]
pub fn open_popout(app_handle: AppHandle) {
  if let Some(window) = app_handle.get_webview_window("popout") {
    let _ = window.unminimize();
    let _ = window.show();
    let _ = window.set_focus();
  } else {
    #[allow(unused_mut)] // mut is used inside cfg gated blocks
    let mut builder =
      WebviewWindowBuilder::new(&app_handle, "popout", WebviewUrl::App("popout".into()))
        .decorations(false)
        .title("Lepse popout")
        .always_on_top(true)
        .inner_size(256.0, 256.0) // default app size
        .resizable(false)
        .effects(
          EffectsBuilder::new()
            .effects(vec![Effect::Acrylic, Effect::Titlebar])
            .build(),
        ); // effects for Windows and MacOS respectively

    #[cfg(not(target_os = "linux"))]
    {
      builder = builder.transparent(true);
    }

    if let Ok(window) = builder.build() {
      let w = window.clone();

      window.on_window_event(move |event| {
        if let tauri::WindowEvent::CloseRequested { api, .. } = event {
          // prevent close
          let _ = w.hide();
          api.prevent_close();

          // emit
          let _ = w.emit_filter("popout-open", false, |t| match t {
            EventTarget::WebviewWindow { label } => label == "main" || label == "popout",
            _ => false,
          });
        }
      });
    }
  }

  let _ = app_handle.emit_filter("popout-open", true, |t| match t {
    EventTarget::WebviewWindow { label } => label == "main" || label == "popout",
    _ => false,
  });
}
