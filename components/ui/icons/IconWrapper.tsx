import React from "react";

const IconWrapper = (OriginalComponent: React.ComponentType<any>) => {
  const newComponent = ({
    size = 20,
    className,
    fill,
    status = "none",
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

    return (
      <div
        className={`flex ${className} ${fill || "fill-white-400 dark:fill-white-300"} ${status !== "none" && "relative"}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      >
        <OriginalComponent {...rest} />
        {status !== "none" && (
          <div
            className={`size-2.5 ${statusColor} absolute right-0 top-0 rounded-full`}
          ></div>
        )}
      </div>
    );
  };
  return newComponent;
};

export default IconWrapper;
