use keyring_core::{set_default_store, Entry, Error};
use std::collections::HashMap;

const KEYRING_SERVICE: &str = "app.lepse.Lepse";

pub fn init_keyring_store(config: &HashMap<&str, &str>) -> Result<(), Error> {
  #[cfg(target_os = "windows")]
  {
    use windows_native_keyring_store::Store;
    set_default_store(Store::new_with_configuration(config)?);
    Ok(())
  }
  #[cfg(target_os = "macos")]
  {
    use apple_native_keyring_store::keychain::Store;
    set_default_store(Store::new_with_configuration(config)?);
    Ok(())
  }
  #[cfg(all(
    unix,
    // NOTE: android and ios is not supported yet, but is still excluded since it falls under the "unix" check
    not(any(target_os = "macos", target_os = "ios", target_os = "android"))
  ))]
  {
    use zbus_secret_service_keyring_store::Store;
    set_default_store(Store::new_with_configuration(config)?);
    Ok(())
  }
}

//
// user will be called key for the sake of my understanding
//

#[tauri::command]
pub fn get_secret(key: &str) -> Result<String, String> {
  let e = Entry::new(KEYRING_SERVICE, key).map_err(|e| e.to_string())?;
  e.get_password().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn set_secret(key: &str, password: &str) -> Result<(), String> {
  let e = Entry::new(KEYRING_SERVICE, key).map_err(|e| e.to_string())?;
  e.set_password(password).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_secret(key: &str) -> Result<(), String> {
  let e = Entry::new(KEYRING_SERVICE, key).map_err(|e| e.to_string())?;
  e.delete_credential().map_err(|e| e.to_string())
}
