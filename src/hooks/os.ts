import { platform } from "@tauri-apps/api/os";
import { useEffect, useState } from "react";

export const useIsWindows = () => {
  const [isWindows, setIsWindows] = useState(false);

  useEffect(() => {
    const setResult = async () => {
      const platformName = await platform();
      setIsWindows(platformName === "win32");
    };
    setResult();
  }, []);

  return isWindows;
};
