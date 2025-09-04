"use client";
import React, { useEffect } from "react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  IPodcastSchema,
  PodcastSchema,
} from "@/lib/validations/podcast.validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Tags from "@/components/contentTypes/Tags";
import GroupSelector from "./GroupSelector";
import ContentBody from "./ContentBody";
import { PodcastContent } from "@/lib/types";
import ContentImageUpload from "./ContentImageUpload";
import { createPodcast, updatePodcast } from "@/lib/actions/podcast.actions";
import Mic from "../ui/icons/Mic";
import PodcastUpload from "./PodcastUpload";

const CreateOrEditPodcast = ({ podcast }: { podcast?: PodcastContent }) => {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const useFormHelpers = useForm<IPodcastSchema>({
    defaultValues: {
      title: podcast?.title || "",
      image: podcast?.image || "",
      body: podcast?.body! || "",
      group: { id: podcast?.group.id || 0, name: podcast?.group.name || "" },
      tags: podcast?.tags! || [],
      audio: podcast?.audio! || "",
      audioTitle: podcast?.audioTitle! || "",
    },
    resolver: zodResolver(PodcastSchema),
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
    if (formState?.tags?.length! > 0) {
      trigger("tags");
    }
  }, [formState.tags, trigger]);

  const onSubmit: SubmitHandler<IPodcastSchema> = async (data) => {
    try {
      if (podcast) {
        const updatedPodcast = await updatePodcast(data, podcast.id);
        if (updatedPodcast) {
          toast.success("Podcast updated successfully");
          router.push(`/podcasts/${updatedPodcast.id}`);
        }
      } else {
        startTransition(async () => {
          const newPodcast = await createPodcast(data);

          if (newPodcast) {
            toast.success("Podcast created successfully");
            router.push(`/podcasts/${newPodcast?.id}`);
          }
        });
      }
    } catch (error) {
      console.log("error in catch", error);
      toast.error("Unable to create or edit podcast");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="m-4 flex w-[840px] flex-col gap-y-8 max-md:mb-24"
    >
      <section className="w-full flex-col">
        <Label
          htmlFor="podcast-title"
          className="paragraph-3-medium text-dark-800 dark:text-white-200"
        >
          Title
        </Label>
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <Input
              id="podcast-title"
              className="paragraph-3-regular mt-3 bg-white-100 dark:border-dark-border dark:bg-dark-800 dark:text-white-200 dark:placeholder:text-white-400"
              placeholder="Write the title of the podcast"
              value={value}
              aria-invalid={!!errors.title}
              aria-describedby={
                errors.title ? "podcast-title-error" : undefined
              }
              onChange={(event) => {
                onChange(event);
              }}
            />
          )}
        />

        {errors.title && (
          <span
            id="podcast-title-error"
            role="alert"
            className="paragraph-3-regular ml-3 text-destructive-error"
          >
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
      <section className="flex w-full flex-col gap-y-4 rounded-md">
        <Label
          htmlFor="podcast-audio"
          className="paragraph-3-medium text-dark-800 dark:text-white-200"
        >
          Podcast Audio File
        </Label>
        <div className="flex w-full gap-x-2.5  rounded-md bg-white-200 px-5 py-3 dark:bg-dark-800">
          <Mic size={18} className="place-self-center" />

          <Controller
            control={control}
            name="audio"
            render={({ field: { onChange, value } }) => (
              <PodcastUpload
                errors={errors}
                onChange={onChange}
                value={value ?? ""}
                id={podcast?.id || 0}
                inputId="podcast-audio"
              />
            )}
          />
          <div className="flex h-10 w-full items-center justify-center place-self-end">
            {formState.audio && (
              <audio controls controlsList="nodownload noplaybackrate">
                <source src={formState.audio} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}
          </div>
          {errors.audio && (
            <span
              role="alert"
              className="paragraph-3-regular text-destructive-error"
            >
              {errors.audio.message}
            </span>
          )}
        </div>
      </section>
      <section className="flex w-full flex-col gap-y-4">
        <Label
          htmlFor="podcast-audio-title"
          className="paragraph-3-medium text-dark-800 dark:text-white-200"
        >
          Audio Title
        </Label>
        <div className="flex w-full  dark:bg-dark-800">
          <Controller
            control={control}
            name="audioTitle"
            render={({ field: { onChange, value } }) => (
              <Input
                id="podcast-audio-title"
                onChange={onChange}
                value={value}
                placeholder="Enter the title of the Episode. Ex: Podcast Name | Episode 1"
                className="paragraph-3-regular  bg-white-100 dark:border-dark-border dark:bg-dark-800 dark:text-white-200 dark:placeholder:text-white-400"
                aria-invalid={!!errors.audioTitle}
                aria-describedby={
                  errors.audioTitle ? "podcast-audio-title-error" : undefined
                }
              />
            )}
          />

          {errors.audioTitle && (
            <span
              id="podcast-audio-title-error"
              role="alert"
              className="paragraph-3-regular text-destructive-error"
            >
              {errors.audioTitle.message}
            </span>
          )}
        </div>
      </section>
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
            podcast
              ? router.push(`/podcasts/${podcast.id}`)
              : router.push("/podcasts")
          }
        >
          Cancel
        </Button>
        <Button
          className="paragraph-3-bold w-1/2 bg-primary-500 text-white-100 max-md:-order-1 max-md:w-full"
          type="submit"
          disabled={pending}
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : podcast ? (
            "Update podcast"
          ) : (
            "Publish podcast"
          )}
        </Button>
      </section>
    </form>
  );
};

export default CreateOrEditPodcast;
