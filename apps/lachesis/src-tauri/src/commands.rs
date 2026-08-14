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
