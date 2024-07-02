"use client";
import React from "react";
import Items from "./Items";
import { usePathname } from "next/navigation";
import { signUpItems, signInItems, onboardingItems } from "@/lib/constants";
import { useOnboardingContext } from "@/lib/context/OnboardingContext";

const SignUpItems = () => {
  const { step } = useOnboardingContext();
  const path = usePathname();
  return (
    <div className="mt-12 h-[500px] w-[442px] space-y-10 bg-transparent">
      <h1 className="display-1-bold w-full align-top text-white-300">
        {path === "/sign-up" && signUpItems.text}
        {path === "/sign-in" && signInItems.text}{" "}
        {path === "/onboarding" && onboardingItems.text}
      </h1>
      <div className="flex w-full flex-col gap-10">
        {path === "/sign-up" &&
          signUpItems.items.map((item, idx) => (
            <React.Fragment key={item.text}>
              <Items text={item.text} icon={item.icon} />
            </React.Fragment>
          ))}
        {path === "/sign-in" &&
          signUpItems.items.map((item, idx) => (
            <React.Fragment key={item.text}>
              <Items text={item.text} icon={item.icon} />
            </React.Fragment>
          ))}
        {path === "/onboarding" &&
          step === "1" &&
          onboardingItems.items.slice(0, 2).map((item, idx) => (
            <React.Fragment key={item.text}>
              <Items text={item.text} icon={item.icon} />
            </React.Fragment>
          ))}
        {path === "/onboarding" &&
          step === "2" &&
          onboardingItems.items.slice(2, 4).map((item, idx) => (
            <React.Fragment key={item.text}>
              <Items text={item.text} icon={item.icon} />
            </React.Fragment>
          ))}
        {path === "/onboarding" &&
          step === "3" &&
          onboardingItems.items.slice(4, 6).map((item, idx) => (
            <React.Fragment key={item.text}>
              <Items text={item.text} icon={item.icon} />
            </React.Fragment>
          ))}
      </div>
    </div>
  );
};

export default SignUpItems;
