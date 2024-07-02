import { useState } from "react";
import { UploadDropzone } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { Loader2 } from "lucide-react";
import { useToast } from "../ui/use-toast";
import Image from "next/image";
import Upload from "../ui/icons/Upload";

const ContentImageUpload = ({
  onChange,
  value,
}: {
  onChange: (file: string) => void;
  value: string;
}) => {
  const { toast } = useToast();

  const [image, setImage] = useState("");
  const [isUploadComplete, setIsUploadComplete] = useState(true);

  return (
    <section className="dark:rounded-lg dark:border dark:border-dashed dark:border-dark-700">
      <UploadDropzone<OurFileRouter, "contentImage">
        content={{
          button({ isUploading }) {
            return (
              <div className="flex items-center justify-center gap-x-2 text-nowrap p-4">
                {isUploading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    <Upload fill="fill-white-400 dark:fill-white-300" />
                    <p className="paragraph-3-regular text-white-400 dark:text-white-300">
                      {image.length > 0 || value.length > 0
                        ? "Upload a new image"
                        : "Upload a cover image"}
                    </p>
                  </>
                )}
              </div>
            );
          },

          label() {
            return (
              <div className="relative flex size-32 w-full justify-center">
                {!isUploadComplete && (
                  <Loader2
                    size={20}
                    className="flex animate-spin justify-center stroke-white-300"
                  />
                )}
                {image.length > 0 || value.length > 0 ? (
                  <Image
                    src={image || value}
                    fill
                    alt="image"
                    priority
                    onLoad={() => setIsUploadComplete(true)}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                    className="cursor-default"
                  />
                ) : (
                  <p className="paragraph-4-regular cursor-text text-white-400">
                    Drag & Drop or upload png or jpeg up to 16MB
                  </p>
                )}
              </div>
            );
          },
        }}
        appearance={{
          button() {
            return `bg-white-100 w-fit order-[-1] dark:bg-dark-800 paragraph-3-regular text-white-400 dark:text-white-300 p-4 cursor-pointer after:bg-primary-500 ${!isUploadComplete && "disabled:opacity-40"}`;
          },
          uploadIcon() {
            return "hidden";
          },
          allowedContent() {
            return "hidden";
          },
        }}
        endpoint="contentImage"
        onClientUploadComplete={(res) => {
          onChange(res[0].url);
          setImage(res[0].url);
          setIsUploadComplete(false);
          toast({
            description: "Image uploaded successfully",
            variant: "default",
          });
        }}
        onUploadError={(error: Error) => {
          console.log(error);
          toast({
            description: "Error uploading image",
            variant: "destructive",
          });
        }}
        config={{ mode: "auto" }}
      />
    </section>
  );
};

export default ContentImageUpload;
