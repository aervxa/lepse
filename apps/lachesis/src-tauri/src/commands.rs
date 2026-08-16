use std::sync::atomic::{AtomicBool, Ordering};

static WAS_MAXIMIZED: AtomicBool = AtomicBool::new(false);

#[tauri::command]
pub fn get_os() -> String {
  let platform = tauri_plugin_os::type_();
  format!(
    "{} {}",
    match platform {
      // Get distro name preferrably over plain "linux"
      p @ tauri_plugin_os::OsType::Linux => std::fs::read_to_string("/etc/os-release")
        .ok()
        .and_then(|str| {
          str
            .lines()
            .find_map(|line| line.strip_prefix("PRETTY_NAME="))
            .map(|name| name.trim_matches('"').to_string()) // remove the quotes around the name
        })
        .unwrap_or_else(|| p.to_string()),
      // Rest OSs
      p => p.to_string(),
    },
    tauri_plugin_os::version()
  )
}

#[tauri::command]
pub fn is_fullscreen(window: tauri::WebviewWindow) -> Result<bool, String> {
  window.is_fullscreen().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn set_fullscreen(window: tauri::WebviewWindow, fullscreen: bool) -> Result<bool, String> {
  let current_fs = window.is_fullscreen().unwrap_or(false);
  if current_fs == fullscreen {
    return Ok(fullscreen);
  }

  // Check if native decorations are enabled
  let is_decorated = window.is_decorated().unwrap_or(false);
  if is_decorated {
    // Native decorations handle fullscreen transitions natively with full OS smoothness
    window
      .set_fullscreen(fullscreen)
      .map_err(|e| e.to_string())?;
    return Ok(fullscreen);
  }

  // Custom decorations (frameless window) handling
  if fullscreen {
    let is_max = window.is_maximized().unwrap_or(false);
    WAS_MAXIMIZED.store(is_max, Ordering::SeqCst);

    #[cfg(windows)]
    {
      if is_max {
        if let Ok(hwnd) = window.hwnd() {
          unsafe {
            use windows_sys::Win32::Foundation::{BOOL, HWND};
            use windows_sys::Win32::Graphics::Dwm::{
              DwmSetWindowAttribute, DWMWA_TRANSITIONS_FORCEDISABLED,
            };
            use windows_sys::Win32::Graphics::Gdi::{
              GetMonitorInfoW, MonitorFromWindow, MONITORINFO, MONITOR_DEFAULTTONEAREST,
            };
            use windows_sys::Win32::UI::WindowsAndMessaging::{
              GetWindowLongPtrW, SetWindowLongPtrW, SetWindowPos, GWL_STYLE, HWND_TOP,
              SWP_FRAMECHANGED, SWP_NOZORDER, SWP_SHOWWINDOW, WS_MAXIMIZE,
            };

            let raw_hwnd = hwnd.0 as isize as HWND;
            let disable: BOOL = 1;
            DwmSetWindowAttribute(
              raw_hwnd,
              DWMWA_TRANSITIONS_FORCEDISABLED as u32,
              &disable as *const _ as *const _,
              std::mem::size_of::<BOOL>() as u32,
            );

            // Remove WS_MAXIMIZE style in memory so Windows doesn't clamp the resize
            let style = GetWindowLongPtrW(raw_hwnd, GWL_STYLE);
            SetWindowLongPtrW(raw_hwnd, GWL_STYLE, style & !(WS_MAXIMIZE as isize));

            // Get the monitor bounds
            let monitor = MonitorFromWindow(raw_hwnd, MONITOR_DEFAULTTONEAREST);
            let mut monitor_info: MONITORINFO = std::mem::zeroed();
            monitor_info.cbSize = std::mem::size_of::<MONITORINFO>() as u32;
            GetMonitorInfoW(monitor, &mut monitor_info);

            let rc = monitor_info.rcMonitor;
            let width = rc.right - rc.left;
            let height = rc.bottom - rc.top;

            // Direct single-step resize to full monitor bounds (covering taskbar)
            SetWindowPos(
              raw_hwnd,
              HWND_TOP,
              rc.left,
              rc.top,
              width,
              height,
              SWP_NOZORDER | SWP_FRAMECHANGED | SWP_SHOWWINDOW,
            );

            let _ = window.set_fullscreen(true);

            let enable: BOOL = 0;
            DwmSetWindowAttribute(
              raw_hwnd,
              DWMWA_TRANSITIONS_FORCEDISABLED as u32,
              &enable as *const _ as *const _,
              std::mem::size_of::<BOOL>() as u32,
            );

            return Ok(true);
          }
        }
      }
    }

    window.set_fullscreen(true).map_err(|e| e.to_string())?;
  } else {
    let was_max = WAS_MAXIMIZED.swap(false, Ordering::SeqCst);

    #[cfg(windows)]
    {
      if was_max {
        if let Ok(hwnd) = window.hwnd() {
          unsafe {
            use windows_sys::Win32::Foundation::{BOOL, HWND};
            use windows_sys::Win32::Graphics::Dwm::{
              DwmSetWindowAttribute, DWMWA_TRANSITIONS_FORCEDISABLED,
            };

            let raw_hwnd = hwnd.0 as isize as HWND;
            let disable: BOOL = 1;
            DwmSetWindowAttribute(
              raw_hwnd,
              DWMWA_TRANSITIONS_FORCEDISABLED as u32,
              &disable as *const _ as *const _,
              std::mem::size_of::<BOOL>() as u32,
            );

            let _ = window.set_fullscreen(false);
            let _ = window.maximize();

            let enable: BOOL = 0;
            DwmSetWindowAttribute(
              raw_hwnd,
              DWMWA_TRANSITIONS_FORCEDISABLED as u32,
              &enable as *const _ as *const _,
              std::mem::size_of::<BOOL>() as u32,
            );

            return Ok(false);
          }
        }
      }
    }

    window.set_fullscreen(false).map_err(|e| e.to_string())?;
    if was_max {
      let _ = window.maximize();
    }
  }

  Ok(fullscreen)
}

#[tauri::command]
pub fn toggle_fullscreen(window: tauri::WebviewWindow) -> Result<bool, String> {
  let is_fs = window.is_fullscreen().map_err(|e| e.to_string())?;
  set_fullscreen(window, !is_fs)
}
