import { editPicture } from "@/lib/actions/user.actions";
import React from "react";
import { useClerk } from "@clerk/nextjs";
import { useToast } from "../ui/use-toast";
import { UploadButton } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Upload from "../ui/icons/Upload";
import ImageIcon from "../ui/icons/ImageIcon";
import Image from "next/image";
const ProfileImageUpload = ({
  id,
  image,
  errors,
}: {
  id: number;
  image: string;
  errors?: any;
}) => {
  const { toast } = useToast();
  const { user } = useClerk();

  return (
    <>
      <div className=" flex size-[60px] content-center items-center justify-center rounded-full bg-white-100  dark:bg-dark-800 ">
        {image! ? (
          <Image
            src={image!}
            width={60}
            height={60}
            alt="user-image"
            className="size-[60px] shrink-0 rounded-full"
          />
        ) : (
          <ImageIcon />
        )}
      </div>
      <div className="flex h-11  flex-row content-center items-center justify-center rounded-lg bg-white-100   align-middle dark:bg-dark-800">
        <UploadButton
          className="custom-class"
          content={{
            button({ ready, isUploading }) {
              if (ready) {
                return (
                  <div className="flex items-center ">
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
              }
            },
          }}
          appearance={{
            button({ ready, isUploading }) {
              return "paragraph-3-regular !w-fit px-2 bg-white-100  text-white-400 dark:bg-dark-800 dark:text-white-300";
            },
            allowedContent: "hidden",
            container: "focus-visible:ring-0",
          }}
          endpoint="userImage"
          onClientUploadComplete={async (res) => {
            const fileRespone = await fetch(res.filter((item) => item)[0].url);
            const fileBlob = await fileRespone.blob();
            user?.setProfileImage({ file: fileBlob });
            editPicture(id!, res.filter((item) => item)[0].url);

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

export default ProfileImageUpload;
