"use client";
import { onboardingOptions } from "@/lib/constants";
import React, { useTransition } from "react";
import { Checkbox } from "@radix-ui/react-checkbox";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Tech } from "@prisma/client";
import { ITechSchema } from "@/lib/validations/user.validations";
import { Button } from "../ui/button";
import { completeOnboarding } from "@/lib/actions/onboarding.actions";
import { useRouter } from "next/navigation";

import { Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";

const Three = () => {
  const { user } = useUser();
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const heading = onboardingOptions.step["3"].heading;
  const options = onboardingOptions.step["3"].options.map((option) => ({
    val: option.key as Tech,
    label: option.value,
  })) as { val: Tech; label: string }[];
  const form = useForm<ITechSchema>({
    defaultValues: {
      tech: [] as Tech[],
    },
  });

  const handleSubmit = (data: ITechSchema) => {
    try {
      startTransition(async () => {
        const res = await completeOnboarding({
          step: "3",
          option: data.tech as Tech[],
        });
        if (res?.message) {
          await user?.reload();
          router.push("/");
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="h-[574px] w-[442px]  space-y-5 bg-transparent">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <h2 className="display-1-bold align-top text-white-100">{heading}</h2>
          <span className="paragraph2-medium text-white-300">
            Choose as many as you like
          </span>
          <FormField
            control={form.control}
            name="tech"
            render={() => (
              <FormItem className="flex w-[442px] flex-wrap content-center items-center  justify-start gap-5 space-y-0 p-4 ">
                {options.map((item) => (
                  <FormField
                    key={item.label}
                    control={form.control}
                    name="tech"
                    render={({ field: { value, onChange } }) => {
                      return (
                        <FormItem
                          key={item.label}
                          className="flex content-center  items-center  space-y-0 align-top"
                        >
                          <FormControl>
                            <Checkbox
                              className="h-14 content-center items-center justify-center gap-x-5 rounded-[8px] bg-dark-800  p-4 text-white-100 active:scale-95 data-[state=checked]:scale-105 data-[state=checked]:bg-primary-500"
                              checked={value?.includes(item.val)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? onChange([
                                      ...(value ?? []),
                                      item.val,
                                    ] as Tech[])
                                  : onChange(
                                      value?.filter(
                                        (value) => value !== item.val
                                      )
                                    );
                              }}
                            >
                              {item.label}
                            </Checkbox>
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={pending}
            variant="tag"
            className="paragraph-2-bold h-11 w-full gap-x-2.5 bg-primary-500 px-10 py-2.5 text-white-100 "
          >
            Get Started!{" "}
            {pending && <Loader2 size={20} className="animate-spin" />}
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default Three;
