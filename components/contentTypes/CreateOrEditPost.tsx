"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { IPostSchema, PostSchema } from "@/lib/validations/post.validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import ContentBody from "@/components/contentTypes/ContentBody";
import ContentImageUpload from "@/components/contentTypes/ContentImageUpload";
import GroupSelector from "@/components/contentTypes/GroupSelector";
import { createPost, updatePost } from "@/lib/actions/post.actions";
import Tags from "@/components/contentTypes/Tags";

import { PostContent } from "@/lib/types.d";

const CreateOrEditPost = ({ post }: { post?: PostContent }) => {
  const router = useRouter();
  const useFormHelpers = useForm<IPostSchema>({
    defaultValues: {
      title: post?.title ?? "",
      image: post?.image ?? "",
      body: post?.body ?? "",
      group: { id: post?.group.id ?? 0, name: post?.group?.name ?? "" },
      tags: post?.tags ?? [],
    },
    resolver: zodResolver(PostSchema),
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
    trigger,
  } = useFormHelpers;

  const { control } = useFormHelpers;
  const formState = watch();

  useEffect(() => {
    if (formState.tags.length > 0) {
      trigger("tags");
    }
  }, [formState.tags, trigger]);

  const onSubmit: SubmitHandler<IPostSchema> = async (data) => {
    try {
      if (post) {
        const updatedPost = await updatePost(data, post?.id);
        if (updatedPost) {
          router.push(`/posts/${updatedPost.post?.id}`);
        }
      } else {
        const createdPost = await createPost(data);
        if (createdPost) {
          router.push(`/posts/${createdPost.post?.id}`);
        }
      }
    } catch (error) {
      console.log("error in catch", error);
      toast.error("Unable to create or edit post");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="m-4 flex w-[840px] flex-col gap-y-8 max-md:mb-24"
    >
      <section className="w-full flex-col">
        <Label className="paragraph-3-medium text-dark-800 dark:text-white-200">
          Title
        </Label>
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <Input
              className="paragraph-3-regular mt-3 bg-white-100 dark:border-dark-border dark:bg-dark-800 dark:text-white-200 dark:placeholder:text-white-400"
              placeholder="Write the title of the post"
              value={value}
              onChange={(event) => {
                onChange(event);
              }}
            />
          )}
        />

        {errors.title && (
          <span className="paragraph-3-regular ml-3 text-destructive-error">
            {errors.title.message}
          </span>
        )}
      </section>

      <section>
        <Controller
          control={control}
          name="group"
          render={({ field: { onChange, value } }) => (
            <GroupSelector onChange={onChange} value={value.name} />
          )}
        />
        {errors.group && (
          <span className="paragraph-3-regular ml-3 text-destructive-error">
            {errors.group.name?.message}
          </span>
        )}
      </section>

      <Controller
        control={control}
        name="image"
        render={({ field: { onChange, value } }) => (
          <ContentImageUpload onChange={onChange} value={value ?? ""} />
        )}
      />

      <section className="w-full">
        <Controller
          control={control}
          name="body"
          render={({ field: { onChange, value } }) => (
            <ContentBody onChange={onChange} body={value} />
          )}
        />
        {errors.body && (
          <span className="paragraph-3-regular text-destructive-error">
            {errors.body.message}
          </span>
        )}
      </section>

      <section className="w-full flex-col gap-y-4">
        <Tags setValue={setValue} defaultValueTags={formState.tags} />
        {errors.tags && (
          <span className="paragraph-3-regular text-destructive-error">
            {errors.tags.message}
          </span>
        )}
      </section>

      <section className="flex w-full justify-between gap-3 max-md:flex-col">
        <Button
          className="paragraph-3-bold w-1/2 bg-white-100 text-dark-700 max-md:w-full dark:bg-dark-800 dark:text-white-100"
          type="button"
          onClick={() =>
            post ? router.push(`/posts/${post?.id}`) : router.push("/posts")
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
          ) : post ? (
            "Update Post"
          ) : (
            "Publish Post"
          )}
        </Button>
      </section>
    </form>
  );
};

export default CreateOrEditPost;
