import React from "react";
import { UploadButton } from "@/lib/utils";
import { useToast } from "../ui/use-toast";
import { Loader2 } from "lucide-react";

const PodcastUpload = ({
  id,
  onChange,
  errors,
  inputId,
}: {
  onChange: (file: string) => void;
  value: string;
  errors: any;
  id: number;
  inputId?: string;
}) => {
  const { toast } = useToast();

  return (
    <>
      <UploadButton
        endpoint="contentAudio"
        className="podcast-button"
        aria-label="Upload podcast audio file"
        onUploadError={() => {
          toast({
            description: "Failed to upload audio",
            variant: "destructive",
          });
        }}
        content={{
          button({ ready, isUploading }) {
            if (ready) {
              return (
                <div className="flex items-center ">
                  {isUploading ? (
                    <>
                      <Loader2 className="animate-spin" />
                    </>
                  ) : (
                    <div className="subtitle-regular ml-1 w-[75px] items-center justify-center gap-x-2.5 text-nowrap bg-white-100 px-2 py-1 dark:bg-dark-700 dark:text-white-300">
                      Set Audio File
                    </div>
                  )}
                </div>
              );
            }
          },
        }}
        appearance={{
          button({ ready, isUploading }) {
            return "podcast-button";
          },
          allowedContent: "hidden",
          container: "focus-visible:ring-0",
        }}
        onClientUploadComplete={(res) => {
          onChange(res[0].url);

          toast({
            description: "Audio uploaded successfully",
            variant: "default",
          });
        }}
      ></UploadButton>

      {errors.audio && (
        <span className="paragraph-3-regular text-destructive-error">
          {errors.audio.message}
        </span>
      )}
    </>
  );
};

export default PodcastUpload;
