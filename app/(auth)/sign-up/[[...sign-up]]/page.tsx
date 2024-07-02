import React from "react";
import Image from "next/image";
import { SignUp } from "@clerk/nextjs";
import logo from "@/public/logo.png";

export default function Page() {
  return (
    <section className="flex w-full flex-col content-center items-center justify-center">
      <Image src={logo} alt="logo" className="max-lg:mt-11 lg:hidden" />
      <div className="flex w-full justify-center">
        <SignUp
          appearance={{
            variables: {
              colorPrimary: "#825EF6",
              colorInputText: "white",
            },
            elements: {
              formButtonPrimary: {
                textTransform: "uppercase",
              },
            },
          }}
        />
      </div>
    </section>
  );
}
