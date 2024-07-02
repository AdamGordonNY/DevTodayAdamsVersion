import React from "react";
import Image from "next/image";
import Disk from "../ui/icons/Disk";
const PlayCardImage = ({ image }: { image: string }) => {
  return (
    <div className="relative flex size-[150px] items-center justify-center">
      <Image
        src={image}
        alt="image"
        width={150}
        height={150}
        className="absolute z-10 size-[150px] rounded-lg"
      />
      <Disk
        size={150}
        className="absolute justify-items-center justify-self-center rounded-full stroke-dark-800 lg:left-[100px] dark:stroke-white-200"
      />
    </div>
  );
};

export default PlayCardImage;
