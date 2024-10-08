import IconWrapper from "./IconWrapper";

const Bell = (props: any) => {
  return (
    <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#clip0_1639_6395)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18.3325 13.0613H17.9128C19.069 13.0613 20 13.9747 20 15.1015V15.511C20 15.9648 19.6268 16.3266 19.1661 16.3266H0.833873C0.372903 16.3266 0 15.9613 0 15.511V15.1015C0 13.9752 0.93447 13.0613 2.08717 13.0613H1.66748C2.12554 13.0613 2.49994 12.6955 2.49994 12.2442V7.34691C2.49994 3.28752 5.85782 0 10.0001 0C14.1434 0 17.5003 3.28927 17.5003 7.34691V12.2442C17.5003 12.6983 17.8729 13.0613 18.3327 13.0613H18.3325ZM7.08301 17.1429H12.9163C12.9163 18.7208 11.6104 20 9.99967 20C8.38892 20 7.08301 18.7208 7.08301 17.1429Z"
        />
      </g>
      <defs>
        <clipPath id="clip0_1639_6395">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default IconWrapper(Bell);
