import React from "react";
import Image from "next/image";
const ContainedImage = ({
  src,
  className,
  width,
  height,
  alt = "contained-image",
}: {
  src: string;
  className: string;
  width?: number;
  height?: number;
  alt: string;
}) => {
  return (
    <>
      <div className={`relative shrink-0`} style={{ width, height }}>
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            className={`size-full object-cover ${className}`}
          />
        ) : (
          <Image
            src="/placeholder.png"
            alt="contained-image"
            fill
            className={`size-full object-cover ${className}`}
          />
        )}{" "}
      </div>
    </>
  );
};

export default ContainedImage;
