import React from "react";
import { Separator } from "../ui/separator";
import { FormLabel } from "../ui/form";
import { Input } from "../ui/input";

interface EditSocialsProps {
  register?: any;
  errors?: any;
}

const EditSocials = ({ register, errors }: EditSocialsProps) => {
  return (
    <>
      <div className="flex flex-col gap-y-4  pb-5 pt-2.5">
        <Separator
          orientation="horizontal"
          className="size-px w-full  dark:bg-dark-700 dark:text-dark-700"
        />
        <span className="paragraph-1-bold text-dark-800 dark:text-white-200  ">
          Social Media
        </span>

        <div className="flex w-full gap-y-2.5 max-lg:flex-col lg:gap-x-5">
          <div className="flex w-full flex-col lg:w-1/2">
            <FormLabel>Linked In</FormLabel>
            <Input
              {...register(`socialMedia.[${0}].handle`)}
              className="paragraph-3-medium border-dark-border dark:bg-dark-800 dark:text-white-100"
            />

            <Input
              {...register(`socialMedia.[${0}].platform`)}
              value={"LinkedIn"}
              className="hidden"
            />
          </div>
          <div className="flex w-full flex-col lg:w-1/2">
            <FormLabel>Link</FormLabel>
            <Input
              {...register(`socialMedia.[${0}].link`)}
              className="paragraph-3-medium border-dark-border dark:bg-dark-800 dark:text-white-100"
            />
          </div>
        </div>

        <div className="flex w-full gap-y-2.5 max-lg:flex-col lg:gap-x-5">
          <div className="flex w-full flex-col lg:w-1/2">
            <FormLabel>Instagram</FormLabel>
            <Input
              {...register(`socialMedia.[${1}].handle`)}
              className="paragraph-3-medium border-dark-border dark:bg-dark-800 dark:text-white-100"
            />
          </div>
          <div className="flex w-full flex-col lg:w-1/2">
            <FormLabel>Link</FormLabel>
            <Input
              {...register(`socialMedia.[${1}].link`)}
              className="paragraph-3-medium border-dark-border dark:bg-dark-800 dark:text-white-100"
            />

            <Input
              {...register(`socialMedia.[${0}].platform`)}
              value={"Instagram"}
              className="hidden"
            />
          </div>
        </div>
        <div className="flex w-full gap-y-2.5 max-lg:flex-col lg:gap-x-5">
          <div className="flex w-full flex-col lg:w-1/2">
            <FormLabel>Twitter/X</FormLabel>
            <Input
              {...register(`socialMedia.[${2}].handle`)}
              className="paragraph-3-medium border-dark-border dark:bg-dark-800 dark:text-white-100"
            />
          </div>
          <div className="flex w-full flex-col lg:w-1/2">
            <FormLabel>Link</FormLabel>
            <Input
              {...register(`socialMedia.[${2}].link`)}
              className="paragraph-3-medium border-dark-border dark:bg-dark-800 dark:text-white-100"
            />

            <Input
              {...register(`socialMedia.[${0}].platform`)}
              value={"Twitter"}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default EditSocials;
