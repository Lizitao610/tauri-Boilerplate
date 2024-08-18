import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import classNames from "classnames";
import { Search, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SearchInputProps {
  onChange: (value: string) => void;
}

const SearchInput = ({ onChange }: SearchInputProps) => {
  const [searchKey, setSearchKey] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onChange(searchKey);
  }, [searchKey, onChange]);

  useEffect(() => {
    const collapseInput = (e: Event) => {
      if (
        InputWrapRef.current &&
        !InputWrapRef.current.contains(e.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    if (isExpanded && !searchKey) {
      window.addEventListener("click", collapseInput);

      return () => {
        window.removeEventListener("click", collapseInput);
      };
    }
  }, [searchKey, isExpanded]);

  useEffect(() => {
    if (isExpanded) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [isExpanded]);

  const InputWrapRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={InputWrapRef}
      className={classNames(
        "max-w-xs flex items-center rounded-sm relative",
        isExpanded ? "bg-muted" : " w-8 overflow-hidden",
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className={classNames(
          "flex-shrink-0",
          isExpanded ? "cursor-default" : "",
        )}
        onClick={() => {
          setIsExpanded(true);
          inputRef.current?.focus();
        }}
      >
        <Search className={isExpanded ? "h-4 w-4" : "h-5 w-5"} />
      </Button>
      <Input
        ref={inputRef}
        type="text"
        autoComplete="off"
        placeholder={`搜索`}
        className={classNames("bg-muted border-none h-8 pl-0 pr-8")}
        onChange={(e) => {
          setSearchKey(e.target.value);
        }}
        value={searchKey}
      />
      {searchKey && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={classNames(
            "h-7 w-7 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100",
            " absolute  right-1 top-1/2 -translate-y-1/2",
          )}
          onClick={() => {
            setSearchKey("");
            inputRef.current?.focus();
          }}
        >
          <XIcon className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default SearchInput;
