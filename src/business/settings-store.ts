import { emit } from "@tauri-apps/api/event";
import { appDataDir, join } from "@tauri-apps/api/path";
import { Store } from "tauri-plugin-store-api";
import { register, unregisterAll } from "@tauri-apps/api/globalShortcut";
import { setMainWindowVisible } from "@/tauri-commands";

export const getSettingsStore = async () => {
  const appDataDirPath = await appDataDir();
  const store = new Store(await join(appDataDirPath, ".settings.dat"));
  return store;
};

export interface ShortcutsType {
  launch_window: string;
}

export interface SettingsType {
  shortcuts: ShortcutsType;
  language?: string; //  "zh-CN" | "en-US"
}

export const defaultSettings: SettingsType = {
  shortcuts: {
    launch_window: "Ctrl+Shift+S",
  },
  language: undefined,
};

export const getSettings = async <K extends keyof SettingsType>(key: K) => {
  const store = await getSettingsStore();
  const value = await store.get(key);
  let defaultValue = defaultSettings[key];

  if (!value) {
    if (key === "language") {
      const isChina = true;
      defaultValue = (isChina ? "zh-CN" : "en-US") as SettingsType[K];
    }

    if (defaultValue) {
      await updateSettings(key, defaultValue);
    }
  }

  return (value || defaultValue) as SettingsType[K];
};

export const updateSettings = async <K extends keyof SettingsType>(
  key: K,
  value: SettingsType[K],
) => {
  const store = await getSettingsStore();
  await store.set(key, value);
  await store.save();
  emit("update_settings", {});
  return value;
};

export const updateShortcuts = async (
  key: keyof typeof defaultSettings.shortcuts,
  value: string,
) => {
  const shortcuts = await getSettings("shortcuts");
  await updateSettings("shortcuts", {
    ...shortcuts,
    [key]: value,
  });
  emit("register_shortcuts", {});
};

const shortcutsHandler: {
  [K in keyof typeof defaultSettings.shortcuts]: () => void;
} = {
  launch_window: async () => {
    setMainWindowVisible(true);
  },
};

export const registerShortcuts = async () => {
  const shortcutsSettings = await getSettings("shortcuts");
  await unregisterAll();
  for (const key in shortcutsSettings) {
    if (shortcutsSettings.hasOwnProperty(key)) {
      const shortcut = shortcutsSettings[key as keyof typeof shortcutsSettings];
      const handler = shortcutsHandler[key as keyof typeof shortcutsHandler];
      if (shortcut && handler) {
        register(shortcut, handler);
      }
    }
  }
};
