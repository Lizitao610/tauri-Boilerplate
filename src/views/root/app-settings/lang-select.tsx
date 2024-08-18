import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateSettings } from "@/business/settings-store"
import { invoke } from "@tauri-apps/api/tauri"

import { useTranslation } from "react-i18next"

export function LangSelect({ transparent = false }: { transparent?: boolean }) {
  const { t, i18n } = useTranslation()

  const handleLangChange = (lang: string) => {
    i18n.changeLanguage(lang)
    updateSettings("language", lang)
  }

  return (
    <Select onValueChange={handleLangChange} value={i18n.language}>
      <SelectTrigger
        className={transparent ? "bg-transparent border-none text-xs" : ""}
      >
        <SelectValue placeholder={t("Choose Language")} />
      </SelectTrigger>
      <SelectContent className={transparent ? "bg-transparent" : ""}>
        <SelectGroup>
          <SelectItem
            value="en-US"
            className={
              transparent ? "focus:bg-none! cursor-pointer text-xs" : ""
            }
          >
            English
          </SelectItem>
          <SelectItem
            value="zh-CN"
            className={
              transparent ? "focus:bg-none! cursor-pointer text-xs" : ""
            }
          >
            简体中文
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
