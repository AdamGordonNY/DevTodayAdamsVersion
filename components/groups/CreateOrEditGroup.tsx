"use client";

import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { createGroup, updateGroup } from "@/lib/actions/group.actions";
import { IGroupSchema, GroupSchema } from "@/lib/validations/group.validations";
import { GroupContent } from "@/lib/types.d";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import ContentImageUpload from "../contentTypes/ContentImageUpload";
import GroupProfileImageUpload from "./GroupProfileImageUpload";
import GroupMemberTags from "./GroupMemberTags";

const CreateOrEditGroup = ({
  group,
  loggedInUserId,
}: {
  group?: GroupContent;
  loggedInUserId?: number;
}) => {
  const router = useRouter();

  const useFormHelpers = useForm<IGroupSchema>({
    defaultValues: {
      name: group?.name ?? "",
      about: group?.about ?? "",
      profileImage: group?.profileImage ?? "",
      coverImage: group?.coverImage ?? "",
      groupAdmins: group?.admins ?? [],
      groupMembers: group?.members ?? [],
    },
    resolver: zodResolver(GroupSchema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
    control,
    watch,
  } = useFormHelpers;
  const formState = watch();

  const onSubmit: SubmitHandler<IGroupSchema> = async (data) => {
    try {
      if (group) {
        const updatedGroup = await updateGroup(data, group?.id);
        if (updatedGroup) {
          router.push(`/groups/${updatedGroup.group?.id}`);
        }
      } else {
        const createdGroup = await createGroup(data, loggedInUserId as number);
        if (createdGroup) {
          router.push(`/groups/${createdGroup.group?.id}`);
        }
      }
    } catch (error) {
      console.log("error in catch", error);
      toast.error("Unable to create or edit group");
    }
  };

  return (
    <form
      className="m-4 flex w-[840px] flex-col gap-y-8 max-md:mb-24"
      onSubmit={handleSubmit(onSubmit)}
    >
      <section className="flex w-full flex-col">
        <Label className="paragraph-3-medium text-dark-800 dark:text-white-200">
          Group name
        </Label>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <Input
              className="paragraph-3-regular mt-3 bg-white-100 dark:border-dark-border dark:bg-dark-800 dark:text-white-200 dark:placeholder:text-white-400"
              placeholder="Write the name of the group"
              value={value}
              onChange={(event) => {
                onChange(event);
              }}
            />
          )}
        />

        {errors.name && (
          <span className="paragraph-3-regular ml-3 text-destructive-error">
            {errors.name.message}
          </span>
        )}
      </section>

      <div className="flex min-w-full flex-row items-center gap-x-2.5 dark:text-white-300 ">
        <Controller
          control={control}
          name="profileImage"
          render={({ field: { onChange, value } }) => (
            <GroupProfileImageUpload onChange={onChange} value={value ?? ""} />
          )}
        />
      </div>

      <Controller
        control={control}
        name="coverImage"
        render={({ field: { onChange, value } }) => (
          <ContentImageUpload onChange={onChange} value={value ?? ""} />
        )}
      />

      <section>
        <Label className="paragraph-3-medium text-dark-800 dark:text-white-200">
          Group bio
        </Label>

        <Controller
          control={control}
          name="about"
          render={({ field: { onChange, value } }) => (
            <Textarea
              className="paragraph-3-regular mt-3 border bg-white-100 dark:border-dark-border dark:bg-dark-800 dark:text-white-200 dark:placeholder:text-white-400"
              placeholder="Write a short description of the group..."
              value={value}
              onChange={(event) => {
                onChange(event);
              }}
            />
          )}
        />

        {errors.about && (
          <span className="paragraph-3-regular ml-3 text-destructive-error">
            {errors.about.message}
          </span>
        )}
      </section>

      <GroupMemberTags
        setValue={setValue}
        formState={formState}
        defaultValue={formState.groupAdmins}
        memberType="admins"
      />

      <GroupMemberTags
        setValue={setValue}
        formState={formState}
        defaultValue={formState.groupMembers}
        memberType="members"
      />

      <section className="flex w-full justify-between gap-3 max-md:flex-col">
        <Button
          className="paragraph-3-bold w-1/2 bg-white-100 text-dark-700 max-md:w-full dark:bg-dark-800 dark:text-white-100"
          type="button"
          onClick={() =>
            group ? router.push(`/groups/${group?.id}`) : router.push("/groups")
          }
        >
          Cancel
        </Button>
        <Button
          className="paragraph-3-bold w-1/2 bg-primary-500 text-white-100 max-md:-order-1 max-md:w-full"
          type="submit"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : group ? (
            "Update Group"
          ) : (
            "Create Group"
          )}
        </Button>
      </section>
    </form>
  );
};

export default CreateOrEditGroup;
