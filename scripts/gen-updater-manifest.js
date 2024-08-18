import tauriConf from "../src-tauri/tauri.conf.json" assert { type: "json" };
import manifest from "../releases/manifest.json" assert { type: "json" };
import releaseNotes from "../releases/release-notes.json" assert { type: "json" };
import fsSync from "fs";

function getMacOSUpdaterManifest(lang, productName) {
  const updaterJson = {
    version: tauriConf.package.version,
    notes: releaseNotes[tauriConf.package.version] || "",
    pub_date: new Date().toISOString(),
    platforms: manifest.platforms || {},
  };

  const signatureFile = `../../target/universal-apple-darwin/release/bundle/macos/${productName}.app.tar.gz.sig`;
  const signature = fsSync.readFileSync(signatureFile, "utf-8");
  const url = `https://cdn.xxx.com/releases/macos/universal/${productName}/${tauriConf.package.version}.app.tar.gz`;

  updaterJson.platforms["darwin-aarch64"] = {
    signature,
    url,
  };

  updaterJson.platforms["darwin-x86_64"] = {
    signature,
    url,
  };

  fsSync.writeFileSync(
    `./releases/manifest_mac_${lang}.json`,
    JSON.stringify(updaterJson)
  );

  return {
    filePath: `releases/manifest_mac_${lang}.json`,
    ossKey: `releases/manifest_mac_${lang}.json`,
  };
}

function getWindowsUpdaterManifest(lang, productName) {
  const currentVersion = tauriConf.package.version;

  const updaterJson = {
    version: tauriConf.package.version,
    notes: releaseNotes[tauriConf.package.version] || "",
    pub_date: new Date().toISOString(),
    platforms: manifest.platforms || {},
  };

  const signatureFile = `../../target/x86_64-pc-windows-msvc/release/bundle/msi/${productName}_${currentVersion}_x64_${lang}.msi.zip.sig`;
  const signature = fsSync.readFileSync(signatureFile, "utf-8");
  const url = `https://cdn.xxx.com/releases/msi/${lang}/${tauriConf.package.version}.msi.zip`;

  updaterJson.platforms["windows-x86_64"] = {
    signature,
    url,
  };

  fsSync.writeFileSync(
    `./releases/manifest_${lang}.json`,
    JSON.stringify(updaterJson)
  );

  return {
    filePath: `releases/manifest_${lang}.json`,
    ossKey: `releases/manifest_${lang}.json`,
  };
}

export { getMacOSUpdaterManifest, getWindowsUpdaterManifest };
