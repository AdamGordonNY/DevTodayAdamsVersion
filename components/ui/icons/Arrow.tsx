import IconWrapper from "./IconWrapper";

const Arrow = (props: any) => {
  return (
    <svg
      viewBox="0 0 14 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1 6H13M13 6L8.33333 1M13 6L8.33333 11"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconWrapper(Arrow);
