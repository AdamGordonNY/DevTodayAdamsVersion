import { getUser } from "@/lib/actions/user.actions";
import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handleAuth = async () => {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");
  const { user } = await getUser(userId);
  return { user: user?.id };
};

export const ourFileRouter = {
  userImage: f({ image: { maxFileSize: "4MB" } })
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.user);

      console.log("file url", file.url);

      // Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { user: metadata.user, file: file.url };
    }),
  contentImage: f({ image: { maxFileSize: "16MB" } })
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.user);

      console.log("file url", file.url);

      // Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { user: metadata.user, file: file.url };
    }),
  contentAudio: f({ audio: { maxFileSize: "32MB" } })
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.user);
      console.log("file url", file.url);
    }),
  groupProfileImage: f({ image: { maxFileSize: "4MB" } })
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.user);

      console.log("file url", file.url);

      // Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { user: metadata.user, file: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
