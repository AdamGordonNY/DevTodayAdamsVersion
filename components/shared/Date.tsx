import { formatDate } from "date-fns";
import React from "react";

const Date = ({ startTime }: { startTime: Date }) => {
  const formattedDate = formatDate(startTime, "MMM d");

  const month = formattedDate.slice(0, 3);
  const day = formattedDate.slice(4);
  return (
    <div className="flex size-[60px] flex-col  content-center items-center justify-center rounded-[6px] bg-white-200 px-4 py-1 dark:bg-dark-700">
      <span className="paragraph-4-regular uppercase text-dark-800 dark:text-white-400">
        {month!}
      </span>
      <span className="display-2-bold text-primary-500">{day}</span>
    </div>
  );
};

export default Date;
