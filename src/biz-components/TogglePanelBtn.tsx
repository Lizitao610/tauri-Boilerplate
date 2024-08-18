import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setSidebarExpanded } from "@/redux/layoutSlice";
import classNames from "classnames";
import { PanelLeft, PanelLeftDashed, PanelLeftOpen } from "lucide-react";

interface TogglePanelBtnProps {
  className?: string;
}
const TogglePanelBtn = ({ className }: TogglePanelBtnProps) => {
  const sidebarExpanded = useAppSelector(
    (state) => state.layout.sidebarExpanded,
  );
  const dispatch = useAppDispatch();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={classNames(className)}
      onClick={() => {
        dispatch(setSidebarExpanded(!sidebarExpanded));
      }}
    >
      {sidebarExpanded ? (
        <PanelLeft className="h-5 w-5" />
      ) : (
        <PanelLeftDashed className="h-5 w-5" />
      )}
    </Button>
  );
};

export default TogglePanelBtn;
