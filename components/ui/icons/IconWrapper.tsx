import React from "react";

const IconWrapper = (OriginalComponent: React.ComponentType<any>) => {
  const newComponent = ({
    size = 20,
    className,
    fill,
    status = "none",
    decorative = true,
    statusLabelMap = {
      online: "Online",
      away: "Away",
      offline: "Offline",
      newWithBorder: "New",
      newWithoutBorder: "New",
    },
    ...rest
  }: {
    size?: number;
    className?: string;
    fill?: string;
    status?:
      | "newWithBorder"
      | "newWithoutBorder"
      | "online"
      | "away"
      | "offline"
      | "none";
    decorative?: boolean;
    statusLabelMap?: Record<string, string>;
  }) => {
    const colorMap = {
      newWithBorder: "bg-primary-500 border-primary-100 border",
      newWithoutBorder: "bg-primary-500",
      online: "bg-green-500",
      away: "bg-red-500",
      offline: "bg-gray-500",
      none: "",
    };
    const statusColor = colorMap[status];

    const label = status !== "none" ? statusLabelMap[status] : undefined;
    return (
      <div
        className={`flex ${className} ${fill || "fill-white-400 dark:fill-white-300"} ${status !== "none" && "relative"}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
        role={!decorative ? "img" : undefined}
        aria-label={!decorative && label ? label : undefined}
        aria-hidden={decorative ? true : undefined}
      >
        <OriginalComponent
          aria-hidden={decorative ? true : undefined}
          {...rest}
        />
        {status !== "none" && (
          <div
            className={`size-2.5 ${statusColor} absolute right-0 top-0 rounded-full`}
            aria-hidden="true"
          >
            {!decorative && label && <span className="sr-only">{label}</span>}
          </div>
        )}
      </div>
    );
  };
  return newComponent;
};

export default IconWrapper;
