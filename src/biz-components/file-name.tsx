import classNames from "classnames";
import { useEffect, useState } from "react";
import { basename } from "@tauri-apps/api/path";

interface FileNameProps {
  path: string;
}

const FileName = ({ path }: FileNameProps) => {
  const [name, setName] = useState(path);

  useEffect(() => {
    basename(path).then((name) => {
      setName(name);
    });
  }, [path]);

  return <div className={classNames("line-clamp-1 break-all")}>{name}</div>;
};

export default FileName;
