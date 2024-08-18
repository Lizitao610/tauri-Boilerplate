import { Outlet, useLoaderData, useOutletContext } from "react-router-dom";
import { AsyncReturnType } from "src/typings/utilityTypes";
import Nav from "./nav";
import { Toaster } from "@/components/ui/toaster";
import Status from "./status";
import { useEffect } from "react";
import { useIsWindows } from "@/hooks/os";
import { usePreventContextmenu } from "@/utils/dom";
import { useListener } from "@/event";
import { TauriEvent } from "@tauri-apps/api/event";
import { setMainWindowVisible } from "@/tauri-commands";
import { useRegisterShortcuts } from "@/hooks/settings";

export const loader = async () => {
  const configs = {};
  return configs;
};

const resetStyle = (isWin?: boolean) => {
  // 尝试重置win10上多出来的border
  document.body.style.backgroundColor = "transparent";
  document.body.style.border = "none";
  document.documentElement.style.backgroundColor = "transparent";
  document.documentElement.style.border = "none";
  document.getElementById("root")!.style.backgroundColor = "transparent";
  // if (isWin) {
  //   document.body.style.padding = "6px";
  // }
};

interface RootOutletContext {
  configs: AsyncReturnType<typeof loader>;
}

export const useRootOutletContext = () => {
  const context = useOutletContext() as RootOutletContext;
  return context;
};

const Root = () => {
  const configs = useLoaderData() as AsyncReturnType<typeof loader>;
  const context: RootOutletContext = { configs };
  const isWin = useIsWindows();

  usePreventContextmenu();

  useEffect(() => {
    resetStyle(isWin);
  }, [isWin]);

  useListener(TauriEvent.WINDOW_CLOSE_REQUESTED, () => {
    setMainWindowVisible(false);
  });

  useRegisterShortcuts();

  return (
    <div className={"w-full h-full flex flex-col bg-background rounded-sm"}>
      {/* <Nav /> */}

      <div className="flex-1 overflow-auto">
        <Outlet context={context} />
      </div>

      {/* <Status /> */}
      <Toaster />
    </div>
  );
};

export default Root;
