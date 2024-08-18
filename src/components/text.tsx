import classNames from "classnames";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useEffect, useRef, useState } from "react";

interface TextProps {
  value: string;
  className?: string;
}

const Text = ({ value, className }: TextProps) => {
  const textRef = useRef<HTMLButtonElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      setIsTruncated(textRef.current.scrollWidth > textRef.current.clientWidth);
    }
  }, [value]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          className={classNames(
            " max-w-full text-ellipsis overflow-hidden whitespace-nowrap cursor-default",
            className,
          )}
          ref={textRef}
        >
          {value}
        </TooltipTrigger>
        {isTruncated && <TooltipContent>{value}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
};
export default Text;
