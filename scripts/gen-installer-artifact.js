import tauriConf from "../src-tauri/tauri.conf.json" assert { type: "json" };

function getMacOSInstallerFile(productName) {
  const currentVersion = tauriConf.package.version;

  return {
    ossKey: `releases/${productName}_${currentVersion}_universal.dmg`,
    filePath: `../../target/universal-apple-darwin/release/bundle/dmg/${productName}_${currentVersion}_universal.dmg`,
  };
}

function getWindowsInstallerFile(lang, productName) {
  const currentVersion = tauriConf.package.version;

  return {
    ossKey: `releases/${productName}_${currentVersion}_${lang}.msi`,
    filePath: `../../target/x86_64-pc-windows-msvc/release/bundle/msi/${productName}_${currentVersion}_x64_${lang}.msi`,
  };
}

export { getWindowsInstallerFile, getMacOSInstallerFile };
