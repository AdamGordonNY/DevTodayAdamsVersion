import { IconWrapper } from ".";

export const ProfilePlaceholder = (props: any) => {
  return (
    <svg
      className="flex rounded-full bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-green-400 via-blue-500 to-purple-500"
      {...props}
    ></svg>
  );
};

export default IconWrapper(ProfilePlaceholder);
