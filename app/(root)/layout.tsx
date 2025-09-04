import FixedAudioPlayer from "@/components/contentTypes/FixedAudioPlayer";
import Header from "@/components/header/Header";
import { Toaster } from "@/components/ui/toaster";
import AudioProvider from "@/lib/context/AudioContext";

import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <AudioProvider>
      <Header />
      {/* Main content area (skip link target) */}
      <main
        id="main-content"
        className="flex min-h-screen w-full flex-1 justify-center bg-white-200 dark:bg-dark-900"
      >
        {children}
      </main>
      <Toaster />
      <div className="pb-20">
        <FixedAudioPlayer />
      </div>
    </AudioProvider>
  );
};

export default Layout;
