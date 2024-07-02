import React, { useState } from "react";
import { useToast } from "../ui/use-toast";
import { UploadButton } from "../../lib/utils";
import { Loader2 } from "lucide-react";
import Upload from "../ui/icons/Upload";
import ImageIcon from "../ui/icons/ImageIcon";
import Image from "next/image";

const GroupProfileImageUpload = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (file: string) => void;
}) => {
  const { toast } = useToast();
  const [image, setImage] = useState("");

  const [isUploadComplete, setIsUploadComplete] = useState(true);

  return (
    <>
      <div className=" flex size-[60px] content-center items-center justify-center rounded-full bg-white-100  dark:bg-dark-800 ">
        {image.length > 0 || value.length > 0 ? (
          <Image
            src={image || value}
            width={60}
            height={60}
            alt="user-image"
            className="size-[60px] rounded-full"
          />
        ) : (
          <ImageIcon />
        )}
      </div>
      <div className="flex h-11  flex-row content-center items-center justify-center rounded-lg bg-white-100   align-middle dark:bg-dark-800">
        <UploadButton
          className="custom-class"
          content={{
            button({ isUploading }) {
              return (
                <div className="flex items-center">
                  {isUploading ? (
                    <Loader2 className="mr-2 animate-spin" />
                  ) : (
                    <Upload className="ml-2 fill-white-400  dark:fill-white-300" />
                  )}
                  {isUploading ? (
                    <span className="mr-2 whitespace-nowrap">
                      {" "}
                      Uploading...
                    </span>
                  ) : (
                    <span className="mr-2 whitespace-nowrap">
                      Set a Profile Photo
                    </span>
                  )}
                </div>
              );
            },
          }}
          appearance={{
            button() {
              return "paragraph-3-regular !w-fit px-2 bg-white-100 text-white-400 dark:bg-dark-800 dark:text-white-300";
            },
            allowedContent: "hidden",
            container: "focus-visible:ring-0",
          }}
          endpoint="groupProfileImage"
          onClientUploadComplete={async (res) => {
            onChange(res[0].url);
            setImage(res[0].url);
            setIsUploadComplete(false);
            toast({
              description: "Image uploaded successfully",
              variant: "default",
            });
          }}
          onUploadError={() => {
            toast({
              description: "Failed to upload image",
              variant: "destructive",
            });
          }}
        ></UploadButton>
      </div>
    </>
  );
};

export default GroupProfileImageUpload;
