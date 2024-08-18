import { isValidUrl } from "@/utils/common";
import { invoke } from "@tauri-apps/api/tauri";

export const open = async (path: string) => {
  await invoke<string>("open", { path });
};

export const setMainWindowVisible = async (visible: boolean) => {
  await invoke("set_main_window_visible", { visible });
};

export const getCraftLogLevel = async () => {
  try {
    const logLevel = "error";
    return logLevel;
  } catch (error) {
    console.error(error);
    return "";
  }
};

export const setCraftLogLevel = async (level: string) => {
  console.log("setCraftLogLevel", level);
};

export const exportLogDir = async () => {
  console.log("exportLogDir");
};

export const fetchUrlFavicon = async (url: string) => {
  try {
    return await invoke<string>("fetch_url_favicon", {
      url,
    });
  } catch (error) {
    console.error("fetch_url_favicon error", error);
  }
};

export interface UrlMetadata {
  title?: string;
  description?: string;
  image?: string;
}

export const fetchUrlMetadata = async (url: string) => {
  try {
    const urlMetadata = await invoke<UrlMetadata>("fetch_url_metadata", {
      url,
    });

    // image 有可能是绝对路径
    if (urlMetadata.image && !isValidUrl(urlMetadata.image)) {
      const urlObject = new URL(url);
      urlMetadata.image = new URL(
        urlMetadata.image,
        urlObject.origin,
      ).toString();
    }

    return urlMetadata;
  } catch (error) {
    console.error(error);
  }
};

export const filterFiles = async (paths: string[]) => {
  return await invoke<string[]>("filter_files", { paths });
};
