import { invoke } from "@tauri-apps/api/tauri";

export const copyImage = async (path: string) => {
  await invoke("copy_image", { path: path });
};
