import { useIsWindows } from "@/hooks/os";
import { useSettings } from "@/hooks/settings";
import { getKeyComboDisplayValue } from "@/utils/common";
import { useTranslation } from "react-i18next";

export default function Status() {
  const { t } = useTranslation();
  const shortcuts = useSettings("shortcuts");
  const isWin = useIsWindows();

  return (
    <div className="h-6 border-t px-3 text-xs grid grid-cols-3 items-center">
      <span className=" opacity-75">
        {/* {getKeyComboDisplayValue(shortcuts?.launch_window ?? "")} 打开窗口 */}
        支持通过粘贴({isWin ? "Control" : "Command"}+v)、拖动文件快捷添加！
      </span>
      <span></span>
      <span className=" text-right opacity-75"></span>
    </div>
  );
}
