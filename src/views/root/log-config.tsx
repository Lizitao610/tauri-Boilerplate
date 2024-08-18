import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { setCraftLogLevel } from "@/tauri-commands"
import { register, unregister } from "@tauri-apps/api/globalShortcut"
import { useEffect, useState } from "react"

export default function LogConfig() {
  const [open, setOpen] = useState(false)

  // useEffect(() => {
  //   unregister("CommandOrControl+Shift+L").then(() => {
  //     register("CommandOrControl+Shift+L", () => {
  //       console.log("Shortcut triggered");
  //       setOpen(true);
  //     });
  //   });
  // }, []);

  const [loglevel, setLoglevel] = useState("error")
  useEffect(() => {
    ;(async () => {
      await setCraftLogLevel("warn")
    })()
  }, [])
  const handleSaveChanges = async () => {
    await setCraftLogLevel(loglevel)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>日志设置</DialogTitle>
          <DialogDescription>
            设置日志级别，从上往下日志越来越详细，ERROR 日志最少，TRACE
            日志最多。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              日志级别
            </Label>
            <Select onValueChange={setLoglevel} value={loglevel}>
              <SelectTrigger className="w-[180px] rounded-sm">
                <SelectValue placeholder="请选择" />
              </SelectTrigger>
              <SelectContent className="rounded-sm">
                <SelectGroup>
                  <SelectItem value="error">ERROR</SelectItem>
                  <SelectItem value="warn">WARN</SelectItem>
                  <SelectItem value="info">INFO</SelectItem>
                  <SelectItem value="debug">DEBUG</SelectItem>
                  <SelectItem value="trace">TRACE</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSaveChanges}>保存修改</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
