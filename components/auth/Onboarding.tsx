"use client";
import React from "react";
import One from "./One";
import Two from "./Two";
import Three from "./Three";
import { useOnboardingContext } from "@/lib/context/OnboardingContext";

const OnboardingForm = () => {
  const { step } = useOnboardingContext();
  const renderStep = () => {
    switch (step) {
      case "1":
        return <One />; // dont send argument for any component
      case "2":
        return <Two />;
      case "3":
        return <Three />;
      default:
        return <One />;
    }
  };

  return <>{renderStep()}</>;
};

export default OnboardingForm;
