import React from "react";

const Disk = (props: any) => {
  return (
    <svg
      width="130"
      height="130"
      viewBox="0 0 130 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="65" cy="65" r="65" fill="#3F4354" />
      <circle
        cx="65"
        cy="65"
        r="21"
        fill="#808191"
        stroke="#C5D0E6"
        strokeWidth="2"
      />
      <circle
        cx="65"
        cy="65"
        r="11"
        fill="#F8FAFC"
        stroke="#C5D0E6"
        strokeWidth="2"
      />
    </svg>
  );
};

export default Disk;
