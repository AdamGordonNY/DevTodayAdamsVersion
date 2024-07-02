"use client";

import React, { createContext, useContext, useState } from "react";

interface AudioContextProps {
  url: string;
  isPlaying: boolean;
  setUrl: (url: string) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  setAudio: (href: string) => void;
}
const AudioContext = createContext<AudioContextProps>({
  url: "",
  setUrl: (url) => {},
  open: false,
  setOpen: (open) => {},
  setAudio: (href: string) => {},
  isPlaying: false,
  setIsPlaying: (isPlaying) => {},
});
const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [url, setUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [open, setOpen] = useState(false);
  const setAudio = (href: string) => {
    setUrl(href);
    setOpen(true);
  };

  return (
    <AudioContext.Provider
      value={{
        url,
        setUrl,
        open,
        setOpen,
        isPlaying,
        setIsPlaying,
        setAudio,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
export const useAudioContext = () => {
  const context = useContext(AudioContext);
  return context;
};
export default AudioProvider;
