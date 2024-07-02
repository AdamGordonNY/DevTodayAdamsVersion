import IconWrapper from "./IconWrapper";

const CaretUp = (props: any) => {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M2.9163 8L6.99967 3.9167L11.083 8"
        stroke="#808191"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconWrapper(CaretUp);
