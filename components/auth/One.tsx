import React from "react";
import { onboardingOptions } from "@/lib/constants";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Levels } from "@prisma/client";
import { Button } from "../ui/button";
import { ILevelsSchema } from "@/lib/validations/user.validations";

import { updateUserOnboardingStep } from "@/lib/actions/onboarding.actions";
import { useOnboardingContext } from "@/lib/context/OnboardingContext";
import { Loader2 } from "lucide-react";

const One = () => {
  const { setStep } = useOnboardingContext();
  const [pending, startTransition] = React.useTransition();
  const options = onboardingOptions.step["1"].options;
  const form = useForm<ILevelsSchema>({
    defaultValues: {
      level: Levels.LearningEnthusiast,
    },
  });
  const onSubmit = async (data: ILevelsSchema) => {
    try {
      startTransition(async () => {
        const res = await updateUserOnboardingStep({
          step: "1",
          option: data.level!,
        });
        if (res) {
          setStep("2");
        }
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <section className="h-[574px] w-[442px]  bg-transparent">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="py-4.5 h-10 w-full gap-x-5 space-y-10 rounded-lg px-5"
        >
          {" "}
          <h2 className="display-1-bold align-top text-white-100">
            {onboardingOptions.step["1"].heading}
          </h2>
          <div className="flex h-[370px] flex-col space-y-5">
            <FormField
              control={form.control}
              name="level"
              render={({ field }: any) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      itemType="radio"
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      {options.map((option) => (
                        <RadioGroupItem
                          key={option.key}
                          className="active:scale-95 aria-checked:scale-105"
                          {...form.register("level")}
                          value={option.key}
                        >
                          {option.value}
                        </RadioGroupItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
            <Button
              type="submit"
              variant="tag"
              disabled={pending}
              className="paragraph-2-bold h-11 w-full gap-x-2.5 bg-primary-500 px-10 py-2.5 text-white-100 "
            >
              Next{pending && <Loader2 size={20} className="animate-spin" />}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default One;
