import IconWrapper from "./IconWrapper";

const CaretDown = (props: any) => {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M11.0837 6L7.00033 10.0833L2.91699 6"
        stroke="#808191"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconWrapper(CaretDown);
