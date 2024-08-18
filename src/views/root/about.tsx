import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getVersion } from "@tauri-apps/api/app"
import { useRequest } from "ahooks"
import { Rocket } from "lucide-react"
import { useTranslation } from "react-i18next"

const About = ({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) => {
  const { data: version } = useRequest(getVersion, {})
  const { t, i18n } = useTranslation()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className=" mb-0">
          <DialogTitle className="text-base inline-flex items-center gap-2">
            <Rocket className=" w-4" />
            {t("Current Version")} {version}
          </DialogTitle>
        </DialogHeader>
        <div className=" text-xs space-y-1 "></div>
      </DialogContent>
    </Dialog>
  )
}

export default About
