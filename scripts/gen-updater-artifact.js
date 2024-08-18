import tauriConf from "../src-tauri/tauri.conf.json" assert { type: "json" };

function getMacOSUpdaterFile(productName) {
  return {
    filePath: `../../target/universal-apple-darwin/release/bundle/macos/${productName}.app.tar.gz`,
    ossKey: `releases/macos/universal/${productName}/${tauriConf.package.version}.app.tar.gz`,
  };
}

function getWindowsUpdaterFile(lang, productName) {
  const currentVersion = tauriConf.package.version;

  return {
    filePath: `../../target/x86_64-pc-windows-msvc/release/bundle/msi/${productName}_${currentVersion}_x64_${lang}.msi.zip`,
    ossKey: `releases/msi/${lang}/${tauriConf.package.version}.msi.zip`,
  };
}

export { getMacOSUpdaterFile, getWindowsUpdaterFile };
