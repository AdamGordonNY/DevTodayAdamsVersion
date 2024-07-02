import React from "react";
import { onboardingOptions } from "@/lib/constants";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useForm } from "react-hook-form";

import { FormControl, FormField, FormItem, Form } from "../ui/form";
import { Goals } from "@prisma/client";
import { IGoalsSchema } from "@/lib/validations/user.validations";
import { updateUserOnboardingStep } from "@/lib/actions/onboarding.actions";
import { Button } from "../ui/button";
import { useOnboardingContext } from "@/lib/context/OnboardingContext";
import { Loader2 } from "lucide-react";

const Two = () => {
  const { setStep } = useOnboardingContext();
  const [pending, startTransition] = React.useTransition();
  const form = useForm<IGoalsSchema>({
    defaultValues: {
      goal: Goals.BuildPortfolio,
    },
  });
  const heading = onboardingOptions.step["2"].heading;
  const options = onboardingOptions.step["2"].options;
  const onSubmit = async (data: IGoalsSchema) => {
    try {
      startTransition(async () => {
        const res = await updateUserOnboardingStep({
          step: "2",
          option: data.goal!,
        });
        if (res) {
          setStep("3");
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section className="h-[574px] w-[442px]  bg-transparent">
      {" "}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="py-4.5 h-10 w-full gap-x-5 space-y-10 rounded-lg px-5"
        >
          {" "}
          <h2 className="display-1-bold align-top text-white-100">{heading}</h2>
          <div className="flex h-[370px] flex-col space-y-5">
            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      className="flex flex-col"
                      itemType="radio"
                      onValueChange={field.onChange}
                    >
                      {options.map((option) => (
                        <RadioGroupItem
                          key={option.key}
                          className="active:scale-95 aria-checked:scale-105"
                          {...form.register("goal")}
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
          </div>
          <Button
            type="submit"
            variant="tag"
            disabled={pending}
            className="paragraph-2-bold h-11 w-full gap-x-2.5 bg-primary-500 px-10 py-2.5 text-white-100 "
          >
            Next {pending && <Loader2 size={20} className="animate-spin" />}
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default Two;
