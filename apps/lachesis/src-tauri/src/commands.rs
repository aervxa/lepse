#[tauri::command]
pub fn get_os() -> String {
  let platform = tauri_plugin_os::type_();
  format!(
    "{} {}",
    match platform {
      // Get distro name preferrably over plain "linux" (/run/* is for the bind-mounts inside a flatpak)
      p @ tauri_plugin_os::OsType::Linux => ["/run/host/os-release", "/etc/os-release"]
        .iter()
        .find_map(|p| std::fs::read_to_string(p).ok())
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
pub fn can_transparent() -> bool {
  // disable transparency on cef since it's not supported (https://github.com/tauri-apps/tauri/issues/15718)
  // disable transparency on macos due to macos-private-api (https://v2.tauri.app/reference/config/#transparent)
  cfg!(all(not(feature = "cef"), not(target_os = "macos")))
}
