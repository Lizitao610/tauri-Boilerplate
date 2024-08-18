import { setMainWindowVisible } from "@/tauri-commands";
import {
  SettingsType,
  defaultSettings,
  getSettings,
  registerShortcuts,
} from "@/business/settings-store";
import { useEffect, useState } from "react";
import { useListener } from "src/event";

export const useRegisterShortcuts = () => {
  useListener("register_shortcuts", registerShortcuts, true, true);

  useEffect(() => {
    registerShortcuts();
  }, []);
};

export const useSettings = <K extends keyof SettingsType>(key: K) => {
  const [settings, setSettings] = useState<SettingsType[K]>();

  const _getSettings = async () => {
    const value = await getSettings(key);
    setSettings(value);
  };

  useListener("update_settings", _getSettings, true, true);

  useEffect(() => {
    _getSettings();
  }, []);

  return settings;
};
