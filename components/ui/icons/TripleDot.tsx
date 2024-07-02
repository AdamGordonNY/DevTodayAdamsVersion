import IconWrapper from "./IconWrapper";

const TripleDot = (props: any) => {
  return (
    <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="10" cy="17.5" r="2.5" transform="rotate(-90 10 17.5)" />
      <circle cx="10" cy="10" r="2.5" transform="rotate(-90 10 10)" />
      <circle cx="10" cy="2.5" r="2.5" transform="rotate(-90 10 2.5)" />
    </svg>
  );
};

export default IconWrapper(TripleDot);
