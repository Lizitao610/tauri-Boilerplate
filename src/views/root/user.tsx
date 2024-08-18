import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { open as tauriOpen } from "@tauri-apps/api/shell";
import {
  AlertCircle,
  CreditCard,
  LogOut,
  Settings,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import About from "./about";
import AppSettings from "./app-settings";
import { useTranslation } from "react-i18next";
import { useIsWindows } from "@/hooks/os";
import classNames from "classnames";

const User = () => {
  const { t, i18n } = useTranslation();
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false);
  const isWin = useIsWindows();

  const goToWebsite = async () => {
    const endPoint = "xxx";
    tauriOpen(`${endPoint}`);
  };

  console.log("i18n.language", i18n.language);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="outline" className="rounded-full">
            <UserRound size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={classNames("w-fit relative", isWin ? "left-5" : "-left-3")}
        >
          <DropdownMenuItem onClick={goToWebsite}>
            <span className=" inline-flex items-center gap-2">
              <CreditCard className=" w-4 text-muted-foreground" />
              {t("Account")}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSettingsDialogOpen(true)}>
            <span className=" inline-flex items-center gap-2">
              <Settings className=" w-4 text-muted-foreground" />
              {t("Settings")}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setAboutDialogOpen(true)}>
            <span className=" inline-flex items-center gap-2">
              <AlertCircle className=" w-4 text-muted-foreground" />
              {t("About")}
            </span>
          </DropdownMenuItem>
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {}}>
              <span className=" inline-flex items-center gap-2">
                <LogOut className=" w-4 text-muted-foreground" />
                {t("Sign out")}
              </span>
            </DropdownMenuItem>
          </>
        </DropdownMenuContent>
      </DropdownMenu>
      <AppSettings
        open={settingsDialogOpen}
        onOpenChange={(open) => setSettingsDialogOpen(open)}
      />
      <About
        open={aboutDialogOpen}
        onOpenChange={(open) => setAboutDialogOpen(open)}
      />
    </>
  );
};

export default User;
