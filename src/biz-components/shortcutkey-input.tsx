import { Input } from "@/components/ui/input";
import classNames from "classnames";
import { XCircle } from "lucide-react";
import React, { useState, useEffect, KeyboardEvent } from "react";
import { isRegistered } from "@tauri-apps/api/globalShortcut";
import { useIsWindows } from "@/hooks/os";
import { getSettings } from "@/business/settings-store";
import { useTranslation } from "react-i18next";
import { getKeyComboDisplayValue } from "@/utils/common";

interface ShortcutInputProps {
  onChange: (combo: string) => void;
  className?: string;
  initialValue?: string;
}

const isDuplicate = async (key: string, value: string) => {
  const shortcutsSettings = await getSettings("shortcuts");
  for (const shortcut in shortcutsSettings) {
    if (shortcutsSettings.hasOwnProperty(shortcut)) {
      // @ts-ignore
      if (shortcut !== key && shortcutsSettings[shortcut] === value) {
        return true;
      }
    }
  }
};

const ShortcutInput: React.FC<ShortcutInputProps> = ({
  onChange,
  className,
  initialValue,
}) => {
  const [keyCombo, setKeyCombo] = useState<string>(initialValue || "");
  const [error, setError] = useState<string>("");
  const isWin = useIsWindows();
  const { t } = useTranslation();

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    let combo: string = "";
    if (event.ctrlKey) combo += "Ctrl+";
    if (event.shiftKey) combo += "Shift+";

    if (isWin) {
      if (event.altKey) combo += "Alt+";
    } else {
      if (event.metaKey) combo += "Command+";
      if (event.altKey) {
        combo += "Option+";
        event.key = event.code.replace("Key", "");
      }
    }

    // 检查按键是否为特殊键
    if (!["Control", "Shift", "Alt", "Meta"].includes(event.key)) {
      combo += event.key.toUpperCase();
    }

    const isValidCombo =
      /(\bCtrl\b|\bAlt\b|\bShift\b|\bCommand\b|\bOption\b)\+[^+]+$/.test(combo);

    if (isValidCombo) {
      handleKeyComboChange(combo);
    } else {
      setKeyCombo("");
    }
  };

  const handleKeyComboChange = async (combo: string) => {
    try {
      // 用输入框的方式注册快捷键，是无法检测到冲突的。这里调用这个方法可以用来校验是否合法的快捷键
      const registered = await isRegistered(combo);
      setKeyCombo(combo);
    } catch (error: any) {
      if (typeof error === "string") {
        if (error.includes("AcceleratorParseError")) {
          setError("快捷键不支持当前输入的字符");
        }
      }
    }
  };

  useEffect(() => {
    setError("");
    onChange(keyCombo);
  }, [keyCombo]);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const keyComboDisplayValue = getKeyComboDisplayValue(keyCombo);

  return (
    <div className={classNames(className, "relative")}>
      <Input
        value={keyComboDisplayValue}
        onKeyDown={handleKeyDown}
        placeholder={`${t(
          "Press the shortcut key combination on the keyboard, eg.",
        )} Ctrl+Shift+S`}
        ref={inputRef}
      />
      {keyCombo && (
        <XCircle
          onClick={() => {
            setKeyCombo("");
            inputRef.current?.focus();
          }}
          className="absolute w-3.5 top-1/2 -translate-y-1/2 right-2 cursor-pointer text-gray-400"
        />
      )}
      <span className=" absolute top-[100%] translate-y-1/4 text-xs text-red-400">
        {error}
      </span>
    </div>
  );
};
export default ShortcutInput;
