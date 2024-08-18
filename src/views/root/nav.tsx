import classNames from "classnames";
import { appWindow } from "@tauri-apps/api/window";
import User from "./user";
import LogConfig from "./log-config";
import { Button } from "@/components/ui/button";
import { Minus, X } from "lucide-react";
import { useParams } from "react-router-dom";
import ImageMaximize from "src/assets/icons/Maximize.svg";
import ImageMaximize3 from "src/assets/icons/Maximize-3.svg";
import { useState } from "react";
import { useIsWindows } from "@/hooks/os";

const Nav = () => {
  const isWin = useIsWindows();
  const params = useParams();

  const [isMaximized, setIsMaximized] = useState(false);

  return (
    <div
      data-tauri-drag-region
      className={classNames(
        "h-11 flex items-center justify-between px-3 gap-1 relative",
        "border-b",
      )}
    >
      <div className="flex">
        {isWin ? (
          <div className="flex items-center pl-2">{<User />}</div>
        ) : null}
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
        <LogConfig />
      </div>

      <div className="flex items-center">
        {isWin ? (
          <>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                appWindow.minimize();
              }}
            >
              <Minus size={16} />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                appWindow.isMaximized().then((value) => {
                  setIsMaximized(!value);
                });
                appWindow.toggleMaximize();
              }}
            >
              {isMaximized ? (
                <img src={ImageMaximize3} className=" w-3.5" />
              ) : (
                <img src={ImageMaximize} className=" w-3.5" />
              )}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                appWindow.close();
              }}
            >
              <X size={16} />
            </Button>
          </>
        ) : (
          <div className="ml-2">
            <User />
          </div>
        )}
      </div>
    </div>
  );
};

export default Nav;
