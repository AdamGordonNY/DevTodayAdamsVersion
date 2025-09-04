"use client";

import { APIProvider } from "@vis.gl/react-google-maps";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Calendar } from "lucide-react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { createMeetup, updateMeetup } from "@/lib/actions/meetup.actions";
import { MeetupContent } from "@/lib/types.d";
import {
  IMeetupSchema,
  MeetupSchema,
} from "@/lib/validations/meetup.validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Tags from "@/components/contentTypes/Tags";
import ContentBody from "@/components/contentTypes/ContentBody";
import GroupSelector from "@/components/contentTypes/GroupSelector";
import GoogleMapAutocomplete from "../shared/GoogleMapAutocomplete";
import ContentImageUpload from "./ContentImageUpload";

const CreateOrEditMeetup = ({ meetup }: { meetup?: MeetupContent }) => {
  const router = useRouter();

  const useFormHelpers = useForm<IMeetupSchema>({
    defaultValues: {
      title: meetup?.title ?? "",
      body: meetup?.body ?? "",
      image: meetup?.image ?? "",
      group: { id: meetup?.group?.id ?? 0, name: meetup?.group?.name ?? "" },
      tags: meetup?.tags ?? [],
      startTime:
        meetup?.startTime && meetup?.startTime > new Date()
          ? new Date(meetup?.startTime)
          : new Date(),
      endTime: meetup?.endTime ? new Date(meetup?.endTime) : new Date(),
      location: {
        address: meetup?.address ?? "574A President Street Brooklyn, NY 11215",
        lat: meetup?.latitude ?? 40.68,
        lng: meetup?.longitude ?? -73.98,
      },
    },
    resolver: zodResolver(MeetupSchema),
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

  const minMaxTime = (min: number, sec: number) => {
    return new Date(
      formState.startTime.getFullYear(),
      formState.startTime.getMonth(),
      formState.startTime.getDate(),
      min,
      sec
    );
  };

  const onSubmit: SubmitHandler<IMeetupSchema> = async (data) => {
    try {
      if (meetup) {
        const updatedMeetup = await updateMeetup(data, meetup?.id);
        if (updatedMeetup) {
          router.push(`/meetups/${updatedMeetup.meetup?.id}`);
        }
      } else {
        const createdMeetup = await createMeetup(data);
        if (createdMeetup) {
          router.push(`/meetups/${createdMeetup.meetup?.id}`);
        }
      }
    } catch (error) {
      console.log("error in catch", error);
      toast.error("Unable to create or edit meetup");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="m-4 flex w-[840px] flex-col gap-y-8 max-md:mb-24"
    >
      <section className="w-full flex-col">
        <Label
          htmlFor="meetup-title"
          className="paragraph-3-medium text-dark-800 dark:text-white-200"
        >
          Title
        </Label>
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <Input
              id="meetup-title"
              className="paragraph-3-regular mt-3 bg-white-100 dark:border-dark-border dark:bg-dark-800 dark:text-white-200 dark:placeholder:text-white-400"
              placeholder="Write the title of the meetup"
              value={value}
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "meetup-title-error" : undefined}
              onChange={(event) => {
                onChange(event);
              }}
            />
          )}
        />

        {errors.title && (
          <span
            id="meetup-title-error"
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

      <section className="flex w-full flex-wrap justify-between gap-4">
        <div className="align-center mb-2 flex min-w-fit flex-1 flex-col space-y-2">
          <Label
            htmlFor="meetup-start"
            className="paragraph-3-medium text-dark-800 dark:text-white-200"
          >
            Start Date & Time
          </Label>
          <Controller
            control={control}
            name="startTime"
            render={({ field }) => (
              <ReactDatePicker
                id="meetup-start"
                className="paragraph-3-regular h-10 w-full rounded-md border border-white-border bg-white-100 !px-10 dark:border-dark-border dark:bg-dark-800 dark:text-white-200"
                onChange={(e) => {
                  field.onChange(e);
                  if (e! > formState.endTime) setValue("endTime", e as Date);
                }}
                selected={field.value}
                showTimeSelect
                timeFormat="h:mm aa"
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="MM/dd/yyyy h:mm aa"
                showIcon
                icon={<Calendar className=" stroke-white-400 !px-4" />}
                minDate={new Date()}
                minTime={
                  field.value.getDate() === new Date().getDate()
                    ? new Date()
                    : minMaxTime(0, 0)
                }
                maxTime={minMaxTime(23, 59)}
              />
            )}
          />
        </div>
        <div className="align-center mb-2 flex min-w-fit flex-1 flex-col space-y-2">
          <Label
            htmlFor="meetup-end"
            className="paragraph-3-medium text-dark-800 dark:text-white-200"
          >
            End Date & Time
          </Label>
          <Controller
            control={control}
            name="endTime"
            render={({ field }) => (
              <ReactDatePicker
                id="meetup-end"
                className="paragraph-3-regular h-10 w-full rounded-md border border-white-border bg-white-100 !px-10 dark:border-dark-border dark:bg-dark-800 dark:text-white-200"
                onChange={(e) => field.onChange(e)}
                selected={field.value}
                showTimeSelect
                timeFormat="h:mm aa"
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="MM/dd/yyyy h:mm aa"
                showIcon
                icon={<Calendar className=" stroke-white-400 !px-4" />}
                minDate={formState.startTime}
                minTime={
                  formState.startTime.getDate() === field.value.getDate()
                    ? formState.startTime
                    : minMaxTime(0, 0)
                }
                maxTime={minMaxTime(23, 59)}
              />
            )}
          />
        </div>
      </section>

      <section className="h-80 w-full overflow-hidden rounded-lg">
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GMAPSKEY!}>
          <Controller
            control={control}
            name="location"
            render={({ field: { onChange } }) => (
              <GoogleMapAutocomplete
                onChange={onChange}
                formState={formState}
              />
            )}
          />
        </APIProvider>
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
            meetup
              ? router.push(`/meetups/${meetup?.id}`)
              : router.push("/meetups")
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
          ) : meetup ? (
            "Update Meetup"
          ) : (
            "Publish Meetup"
          )}
        </Button>
      </section>
    </form>
  );
};

export default CreateOrEditMeetup;
