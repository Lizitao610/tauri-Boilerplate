import { useEffect, useRef } from "react";
import { EventCallback, TauriEvent, UnlistenFn } from "@tauri-apps/api/event";
import { appWindow } from "@tauri-apps/api/window";
import { listen } from "@tauri-apps/api/event";

export type CustomEventName =
  | "change_router"
  | "update_settings"
  | "register_shortcuts";

export const useListener = <T,>(
  event: TauriEvent | CustomEventName,
  callback: EventCallback<T>,
  enabled: boolean = true,
  global: boolean = false
) => {
  const unlistenFn = useRef<Promise<UnlistenFn>>();

  useEffect(() => {
    if (enabled) {
      if (global) {
        unlistenFn.current = listen<T>(event, callback);
      } else {
        unlistenFn.current = appWindow.listen<T>(event, callback);
      }

      return () => {
        unlistenFn.current?.then((unlisten) => {
          unlisten();
        });
      };
    }
  }, [enabled, callback]);
};
