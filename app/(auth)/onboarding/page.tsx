import OnboardingForm from "@/components/auth/Onboarding";
import { getUser } from "@/lib/actions/user.actions";
import { auth } from "@clerk/nextjs";
import sitelogo from "@/public/logo.png";
import Image from "next/image";
import React from "react";

const Page = async () => {
  let dbUser;
  const { userId } = auth();
  if (userId) {
    dbUser = await getUser(userId);
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div>
        <Image
          src={sitelogo}
          alt="logo"
          className="mb-10 align-top lg:hidden"
        />
      </div>
      {dbUser && <OnboardingForm />}
    </div>
  );
};

export default Page;
