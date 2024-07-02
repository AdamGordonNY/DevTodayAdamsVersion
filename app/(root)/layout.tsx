import FixedAudioPlayer from "@/components/contentTypes/FixedAudioPlayer";
import Header from "@/components/header/Header";
import { Toaster } from "@/components/ui/toaster";
import AudioProvider from "@/lib/context/AudioContext";

import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen bg-white-200 dark:bg-dark-900 ">
      <AudioProvider>
        <Header />

        <div className="flex w-full flex-1 justify-center"> {children}</div>

        <Toaster />
        <div className="pb-20">
          {" "}
          <FixedAudioPlayer />
        </div>
      </AudioProvider>
    </main>
  );
};

export default Layout;
