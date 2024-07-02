import React from "react";

import sitelogo from "@/public/logo.png";
import Image from "next/image";
import SignUpItems from "@/components/auth/SignUpItems";

import { auth } from "@clerk/nextjs/server";

import { getUser } from "@/lib/actions/user.actions";
import OnboardingProvider from "@/lib/context/OnboardingContext";
import { redirect } from "next/navigation";
interface AuthLayoutProps {
  children: React.ReactNode;
}
const AuthLayout = async ({ children }: AuthLayoutProps) => {
  let step;
  let dbUser;
  const { userId, sessionClaims } = auth();
  if (userId) {
    dbUser = await getUser(userId);
    step = dbUser.user?.onboardingStep?.toString();
  }
  if (sessionClaims?.metadata.onboardingComplete === true) {
    redirect("/");
  }
  return (
    <OnboardingProvider defaultStep={step!}>
      <main className="flex min-h-screen   max-w-full  bg-dark-800">
        <div className=" w-1/2 p-11 max-lg:hidden  ">
          <Image src={sitelogo} alt="logo" className="max-lg:hidden" />
          <div className="flex flex-col items-center justify-center">
            <SignUpItems />
          </div>
        </div>
        <div className="flex w-1/2 items-center justify-center overflow-hidden bg-dark-900 max-lg:w-full">
          {children}
        </div>
      </main>
    </OnboardingProvider>
  );
};

export default AuthLayout;
