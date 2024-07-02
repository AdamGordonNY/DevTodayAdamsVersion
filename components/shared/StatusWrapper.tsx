import React from "react";

type StatusWrapperProps = {
  children: React.ReactNode;
  status?: "new" | "online" | "away" | "offline" | "none";
};

const StatusWrapper = ({ children, status = "none" }: StatusWrapperProps) => {
  const colorMap = {
    new: "bg-primary-500",
    online: "bg-green-500",
    away: "bg-yellow-500",
    offline: "bg-gray-500",
    none: "",
  };
  const className = colorMap[status];

  return (
    <div className="relative w-fit shrink-0">
      <div
        className={`absolute right-0 top-0 size-2.5 rounded-full ${className}`}
      ></div>
      <div className="overflow-hidden rounded-full">{children}</div>
    </div>
  );
};

export default StatusWrapper;
