import {
  getMacOSInstallerFile,
  getWindowsInstallerFile,
} from "./gen-installer-artifact.js";
import {
  getMacOSUpdaterFile,
  getWindowsUpdaterFile,
} from "./gen-updater-artifact.js";
import {
  getMacOSUpdaterManifest,
  getWindowsUpdaterManifest,
} from "./gen-updater-manifest.js";
import OSS from "ali-oss";
import enWinTauriConf from "../src-tauri/tauri.windows.conf.en-US.json" assert { type: "json" };
import zhWinTauriConf from "../src-tauri/tauri.windows.conf.zh-CN.json" assert { type: "json" };
import enMacTauriConf from "../src-tauri/tauri.macos.conf.en-US.json" assert { type: "json" };
import zhMacTauriConf from "../src-tauri/tauri.macos.conf.zh-CN.json" assert { type: "json" };

const uploadToOSS = async (ossKey, filePath, symlinkOssKey) => {
  console.log("[uploadToOSS]");
  console.log("  ossKey =>", ossKey);
  console.log("  filePath =>", filePath);

  const client = new OSS({
    region: "oss-cn-shenzhen",
    accessKeyId: process.env.ALIYUN_AK_ID,
    accessKeySecret: process.env.ALIYUN_AK_SECRET,
    bucket: "xxx-cdn",
  });

  let currentProgress = 0;
  try {
    // 填写OSS文件完整路径和本地文件的完整路径。OSS文件完整路径中不能包含Bucket名称。
    // 如果本地文件的完整路径中未指定本地路径，则默认从示例程序所属项目对应本地路径中上传文件。
    const { res } = await client.multipartUpload(ossKey, filePath, {
      progress: (progress) => {
        const normalizedProgress = Math.floor(progress * 10) * 10;
        if (normalizedProgress !== currentProgress) {
          console.log("  progress =>", normalizedProgress, "%");
          currentProgress = normalizedProgress;
        }
      },
    });
    console.log("  statusMessage =>", res.statusMessage);
  } catch (e) {
    console.log(e);
  }

  if (symlinkOssKey) {
    console.log("[createSymlink]");
    console.log("  symlink =>", symlinkOssKey);
    console.log("  sourceFile =>", ossKey);
    try {
      const { res } = await client.putSymlink(symlinkOssKey, ossKey);
      console.log("  statusMessage =>", res.statusMessage);
    } catch (e) {
      console.log(e);
    }
  }
};

async function uploadArtifacts() {
  const platform = process.env.BUILD_PLATFORM;

  if (platform === "windows") {
    console.log("[uploadArtifacts] platform => windows");
    const enProductName = enWinTauriConf.package.productName;
    const zhProductName = zhWinTauriConf.package.productName;

    const enInstallerFileToUpload = getWindowsInstallerFile(
      "en-US",
      enWinTauriConf.package.productName
    );
    const zhInstallerFileToUpload = getWindowsInstallerFile(
      "zh-CN",
      zhWinTauriConf.package.productName
    );

    const enUpdaterFileToUpload = getWindowsUpdaterFile(
      "en-US",
      enWinTauriConf.package.productName
    );
    const zhUpdaterFileToUpload = getWindowsUpdaterFile(
      "zh-CN",
      zhWinTauriConf.package.productName
    );

    const enUpdaterManifestToUpload = getWindowsUpdaterManifest(
      "en-US",
      enWinTauriConf.package.productName
    );
    const zhUpdaterManifestToUpload = getWindowsUpdaterManifest(
      "zh-CN",
      zhWinTauriConf.package.productName
    );

    await uploadToOSS(
      enInstallerFileToUpload.ossKey,
      enInstallerFileToUpload.filePath,
      `releases/${enProductName}_latest_en-US.msi`
    );

    await uploadToOSS(
      zhInstallerFileToUpload.ossKey,
      zhInstallerFileToUpload.filePath,
      `releases/${zhProductName}_latest_zh-CN.msi`
    );

    await uploadToOSS(
      enUpdaterFileToUpload.ossKey,
      enUpdaterFileToUpload.filePath
    );
    await uploadToOSS(
      zhUpdaterFileToUpload.ossKey,
      zhUpdaterFileToUpload.filePath
    );

    await uploadToOSS(
      enUpdaterManifestToUpload.ossKey,
      enUpdaterManifestToUpload.filePath
    );

    await uploadToOSS(
      zhUpdaterManifestToUpload.ossKey,
      zhUpdaterManifestToUpload.filePath
    );
  }

  if (platform === "macos") {
    const targetLang = process.env.TARGET_LANG;
    console.log("[uploadArtifacts] platform => macos");
    console.log("[uploadArtifacts] targetLang =>", targetLang);

    if (targetLang === "en") {
      const enProductName = enMacTauriConf.package.productName;
      const enInstallerFileToUpload = getMacOSInstallerFile(enProductName);
      const enUpdaterFileToUpload = getMacOSUpdaterFile(enProductName);
      const enUpdaterManifestToUpload = getMacOSUpdaterManifest(
        "en-US",
        enProductName
      );
      await uploadToOSS(
        enInstallerFileToUpload.ossKey,
        enInstallerFileToUpload.filePath,
        `releases/${enProductName}_latest_universal.dmg`
      );
      await uploadToOSS(
        enUpdaterFileToUpload.ossKey,
        enUpdaterFileToUpload.filePath
      );
      await uploadToOSS(
        enUpdaterManifestToUpload.ossKey,
        enUpdaterManifestToUpload.filePath
      );
    }

    if (targetLang === "zh") {
      const zhProductName = zhMacTauriConf.package.productName;
      const zhInstallerFileToUpload = getMacOSInstallerFile(zhProductName);
      const zhUpdaterFileToUpload = getMacOSUpdaterFile(zhProductName);
      const zhUpdaterManifestToUpload = getMacOSUpdaterManifest(
        "zh-CN",
        zhProductName
      );
      await uploadToOSS(
        zhInstallerFileToUpload.ossKey,
        zhInstallerFileToUpload.filePath,
        `releases/${zhProductName}_latest_universal.dmg`
      );
      await uploadToOSS(
        zhUpdaterFileToUpload.ossKey,
        zhUpdaterFileToUpload.filePath
      );
      await uploadToOSS(
        zhUpdaterManifestToUpload.ossKey,
        zhUpdaterManifestToUpload.filePath
      );
    }
  }
}

uploadArtifacts();
