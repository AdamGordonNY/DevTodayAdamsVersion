"use client";

import React, { createContext, useContext, useState } from "react";

interface OnBoardingContextProps {
  step: string;
  setStep: (step: string) => void;
}
const OnboardingContext = createContext<OnBoardingContextProps>({
  step: "1",
  setStep: () => {},
});
const OnboardingProvider = ({
  defaultStep = "1",
  children,
}: {
  defaultStep: string;
  children: React.ReactNode;
}) => {
  const [step, setStep] = useState<string>(defaultStep);

  return (
    <OnboardingContext.Provider value={{ step, setStep }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboardingContext = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error(
      "useOnboardingContext must be used within an OnboardingProvider"
    );
  }
  return context;
};
export default OnboardingProvider;
