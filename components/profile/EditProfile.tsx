"use client";
import React, { useTransition } from "react";

import { Form } from "../ui/form";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { IUserProfileUpdateSchema } from "@/lib/validations/user.validations";

import { Button } from "../ui/button";
import { User, Tech, SocialMedia, Platform } from "@prisma/client";
import EditTechnologies from "./EditTechnologies";

import EditSocials from "./EditSocials";
import { editProfile } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import ProfileImageUpload from "./ProfileImageUpload";
import { Separator } from "../ui/separator";
import EditInformation from "./EditInformation";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useClerk } from "@clerk/nextjs";

interface EditProfileProps {
  user?: Partial<User> & {
    SocialMedia: SocialMedia[];
  };
}
const EditProfile = ({ user }: EditProfileProps) => {
  const router = useRouter();
  const clerk = useClerk();
  const [pending, startTransition] = useTransition();

  const form = useForm<IUserProfileUpdateSchema>({
    defaultValues: {
      id: user?.id,
      firstName: user?.firstName! || "",
      lastName: user?.lastName || "",
      username: user?.username!,
      bio: user?.bio! || "",
      tech: user?.tech! || [],
      image: user?.image! || "",
      socialMedia: user?.SocialMedia.map((social) => ({
        platform: social.platform as Platform,
        handle: social.handle as string,
        link: social.link as string,
      })) || [
        { platform: "LinkedIn", link: "", handle: "" },
        {
          platform: "Instagram",
          link: "",
          handle: "",
        },
        {
          platform: "Twitter",
          link: "",
          handle: "",
        },
      ],
    },
  });

  const handleTagChange = (tags: any) => {
    form.setValue("tech", tags);
  };
  const uniqueTech = Object.keys(Tech).map((key) => Tech[key as Tech]);
  const tech = useWatch({
    name: "tech",
    control: form.control,
  });
  const onSubmit: SubmitHandler<IUserProfileUpdateSchema> = async (
    data: IUserProfileUpdateSchema
  ) => {
    const { tech, socialMedia, ...rest } = data;

    try {
      startTransition(async () => {
        clerk.user?.update({
          firstName: rest.firstName,
          lastName: rest.lastName,
        });
        const result = await editProfile(user?.id!, {
          ...rest,
          tech,
          socialMedia,
        });
        if (result) {
          toast({
            title: "Profile updated successfully",
            variant: "default",
            type: "foreground",
          });
          router.back();
        } else {
          toast({
            title: "Error updating profile",
            variant: "destructive",
            type: "foreground",
          });
        }
      });
    } catch (error) {
      toast({
        title: "Error updating profile",
        variant: "destructive",
        type: "foreground",
      });
    }
  };

  return (
    <section className="profile-wrapper">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-1 flex-col gap-y-8"
        >
          <div className="flex min-w-full flex-row items-center gap-x-2.5 dark:text-white-300 ">
            <ProfileImageUpload id={user?.id!} image={user?.image!} />
          </div>
          <EditInformation control={form.control} />
          <div className="flex w-full flex-1">
            <EditTechnologies
              setTechTags={handleTagChange}
              errors={form.formState.errors}
              uniqueTags={uniqueTech}
              techTags={tech}
            />
          </div>
          <EditSocials register={form.register} />
          <Separator
            orientation="horizontal"
            className="size-px w-full  dark:bg-dark-700 dark:text-dark-700"
          />
          <div className="flex flex-row gap-x-5 gap-y-4 pb-5 max-sm:flex-col">
            <Button className="button-shadow paragraph-3-bold order-2 w-full bg-white-100 text-dark-700 sm:w-1/2 lg:order-1 dark:bg-dark-800 dark:text-white-100 dark:shadow-none">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={pending}
              className="button-shadow paragraph-3-bold order-1 w-full bg-primary-500 sm:w-1/2 lg:order-2 dark:text-white-100 dark:shadow-none"
            >
              Update Profile
              {pending && <Loader2 className="ml-2 animate-spin" />}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default EditProfile;
