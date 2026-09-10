use std::collections::HashMap;

const KEYRING_SERVICE: &str = "app.lepse.Lepse";

/**
 * `config` is for all OS except Linux
 */
pub fn init_keyring_store(config: &HashMap<&str, &str>) -> Result<(), keyring_core::Error> {
  #[cfg(target_os = "windows")]
  {
    keyring_core::set_default_store(windows_native_keyring_store::Store::new_with_configuration(
      config,
    )?);
    Ok(())
  }
  #[cfg(target_os = "macos")]
  {
    keyring_core::set_default_store(
      apple_native_keyring_store::keychain::Store::new_with_configuration(config)?,
    );
    Ok(())
  }
  #[cfg(target_os = "linux")]
  {
    let _ = config; // to prevent unused_variables error (config not used on linux)
    Ok(())
  }
  #[cfg(all(
    unix,
    // Omit all other unix alr handled (mobile not handled, nor supported)
    not(any(target_os = "linux", target_os = "macos", target_os = "ios", target_os = "android"))
  ))]
  {
    keyring_core::set_default_store(
      zbus_secret_service_keyring_store::Store::new_with_configuration(config)?,
    );
    Ok(())
  }
}

#[tauri::command(async)]
pub async fn get_secret(key: &str) -> Result<String, String> {
  #[cfg(target_os = "linux")]
  {
    let keyring = oo7::Keyring::new().await.map_err(|e| e.to_string())?;

    // Get item, there should only be one
    let items = keyring
      .search_items(&[(KEYRING_SERVICE, key)])
      .await
      .map_err(|e| e.to_string())?;
    let item = items
      .first()
      .ok_or_else(|| "Secret not found".to_string())?;

    // Extract secret from item
    let secret = item.secret().await.map_err(|e| e.to_string())?;
    let secret_str = match &secret {
      oo7::Secret::Text(s) => s,
      oo7::Secret::Blob(_) => return Err("Expected text secret, but got blob".to_string()),
    }
    .to_string();

    Ok(secret_str)
  }
  #[cfg(not(target_os = "linux"))]
  {
    let e = keyring_core::Entry::new(KEYRING_SERVICE, key).map_err(|e| e.to_string())?;
    e.get_password().map_err(|e| e.to_string())
  }
}

#[tauri::command(async)]
pub async fn set_secret(key: &str, password: &str) -> Result<(), String> {
  #[cfg(target_os = "linux")]
  {
    let keyring = oo7::Keyring::new().await.map_err(|e| e.to_string())?;

    // Create item
    keyring
      .create_item(
        format!("{}:{}", KEYRING_SERVICE, key).as_str(), // sole purpose of keeping the same interface for usage with keyring-core
        &[(KEYRING_SERVICE, key)],
        password,
        true,
      )
      .await
      .map_err(|e| e.to_string())?;

    Ok(())
  }
  #[cfg(not(target_os = "linux"))]
  {
    let e = keyring_core::Entry::new(KEYRING_SERVICE, key).map_err(|e| e.to_string())?;
    e.set_password(password).map_err(|e| e.to_string())
  }
}

#[tauri::command(async)]
pub async fn delete_secret(key: &str) -> Result<(), String> {
  #[cfg(target_os = "linux")]
  {
    let keyring = oo7::Keyring::new().await.map_err(|e| e.to_string())?;

    // Get item, there should only be one
    let items = keyring
      .search_items(&[(KEYRING_SERVICE, key)])
      .await
      .map_err(|e| e.to_string())?;
    let item = items
      .first()
      .ok_or_else(|| "Secret not found".to_string())?;

    // Delete item
    item.delete().await.map_err(|e| e.to_string())?;

    Ok(())
  }
  #[cfg(not(target_os = "linux"))]
  {
    let e = keyring_core::Entry::new(KEYRING_SERVICE, key).map_err(|e| e.to_string())?;
    e.delete_credential().map_err(|e| e.to_string())
  }
}
