import classNames from "classnames";

const Kbd = ({
  value,
  className,
}: {
  value: string | JSX.Element;
  className?: string;
}) => {
  return (
    <kbd
      className={classNames(
        "inline-flex items-center justify-center text-base bg-white px-2",
        "border rounded-md text-muted-foreground",
        className,
      )}
    >
      {value}
    </kbd>
  );
};

export default Kbd;
