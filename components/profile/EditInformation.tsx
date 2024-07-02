import React from "react";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface EditInformationProps {
  control: any;
}
const EditInformation = ({ control }: EditInformationProps) => {
  return (
    <>
      <div className="flex gap-x-8 max-md:w-full lg:flex-row ">
        <FormField
          control={control}
          name="firstName"
          render={({ field }) => (
            <FormItem className="w-full lg:w-1/2">
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input
                  className="paragraph-3-medium border-dark-border  dark:bg-dark-800 dark:text-white-100 "
                  placeholder={field.value}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={control}
          name="lastName"
          render={({ field }) => (
            <FormItem className="w-full lg:w-1/2">
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input
                  className="paragraph-3-medium border-dark-border  dark:bg-dark-800 dark:text-white-100 "
                  placeholder={field.value}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        ></FormField>
      </div>
      <div className="flex w-full">
        <FormField
          control={control}
          name="username"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled
                  className="paragraph-3-medium border-dark-border  dark:bg-dark-800 dark:text-white-100 "
                />
              </FormControl>
            </FormItem>
          )}
        ></FormField>
      </div>
      <div className="flex w-full flex-1">
        <FormField
          control={control}
          name="bio"
          render={({ field }) => (
            <FormItem className="w-full ">
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  className="paragraph-3-medium resize-none border-dark-border dark:bg-dark-800 dark:text-white-200"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        ></FormField>
      </div>
    </>
  );
};

export default EditInformation;
