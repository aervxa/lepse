pub mod commands;

#[cfg(target_os = "linux")]
type Error = std::io::Error;
#[cfg(any(target_os = "windows", target_os = "macos"))]
type Error = keyring_core::Error;

/**
 * `config` is for all OS except Linux
 */
pub fn init_keyring_store(config: &std::collections::HashMap<&str, &str>) -> Result<(), Error> {
  #[cfg(target_os = "linux")]
  {
    let _ = config; // to prevent unused_variables error (config doesn't exist for the oo7 that linux uses)
    Ok(())
  }
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
}
