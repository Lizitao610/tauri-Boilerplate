import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import ShortcutInput from "@/biz-components/shortcutkey-input"
import { getSettings, updateSettings } from "@/business/settings-store"
import { useRequest } from "ahooks"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useEffect, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import {
  enable as enableAutoStart,
  isEnabled as isAutoStartEnabled,
  disable as disableAutoStart,
} from "tauri-plugin-autostart-api"
import { LangSelect } from "./lang-select"
import { useTranslation } from "react-i18next"
import { ScrollArea } from "@/components/ui/scroll-area"
import { exportLogDir } from "@/tauri-commands"
import { toast } from "@/components/ui/use-toast"
import { updateShortcuts } from "@/business/settings-store"

const AppSettings = ({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) => {
  const { t } = useTranslation()
  const { data: shortcuts } = useRequest(
    async () => {
      return await getSettings("shortcuts")
    },
    { refreshDeps: [open] }
  )

  const [autoStart, setAutoStart] = useState(false)

  useEffect(() => {
    isAutoStartEnabled().then((enabled) => {
      console.log("enabled", enabled)
      setAutoStart(enabled ?? false)
    })
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[512px] max-h-[85%] flex flex-col">
        <DialogHeader>
          <DialogTitle className=" text-xl">{t("Settings")}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 pt-2 flex-1 overflow-auto">
          <div className=" space-y-4">
            <div className="text-lg text-black">{t("Shortcuts")}</div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-normal">{t("MultipleSearch Hotkey")}</Label>
                <ShortcutInput
                  onChange={async (combo) => {
                    updateShortcuts("launch_window", combo)
                  }}
                  className=""
                  initialValue={shortcuts?.launch_window}
                />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="text-lg text-black">{t("General")}</div>
            <div className="space-y-5">
              <div className="flex items-center space-x-2 w-40">
                <LangSelect />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  className="rounded-[4px]"
                  checked={autoStart}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      enableAutoStart()
                    } else {
                      disableAutoStart()
                    }
                    setAutoStart(checked as boolean)
                  }}
                />
                <label
                  htmlFor="terms"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t("Launch at startup")}
                </label>
              </div>
              <div>
                <Button
                  variant={"outline"}
                  onClick={async () => {
                    try {
                      await exportLogDir()
                    } catch (error: any) {
                      toast({
                        variant: "destructive",
                        title: t("Log file not found"),
                      })
                    }
                  }}
                >
                  {t("Export exception log")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AppSettings
