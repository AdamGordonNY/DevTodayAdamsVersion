import React from "react";
import IconWrapper from "./IconWrapper";

const TagX = (props: any) => {
  return (
    <svg
      width="6"
      height="7"
      viewBox="0 0 6 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.4375 1.0625L0.5625 5.9375M0.5625 1.0625L5.4375 5.9375"
        stroke="#C5D0E6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconWrapper(TagX);
