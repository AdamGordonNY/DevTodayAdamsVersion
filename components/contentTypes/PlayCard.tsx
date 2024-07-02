"use client";
import React, { useEffect, useState } from "react";
import { getUserById } from "@/lib/actions/user.actions";

import { useAudioContext } from "@/lib/context/AudioContext";
import PlayCardImage from "./PlayCardImage";

import { Button } from "../ui/button";

import { Pause, Play } from "lucide-react";
interface PlayCardProps {
  title: string;
  image: string;
  audio: string;
  userId: number;
}
const PlayCard = ({ title, image, userId, audio }: PlayCardProps) => {
  const [name, setName] = useState("");
  const { setUrl, isPlaying, setAudio, setOpen } = useAudioContext();

  useEffect(() => {
    const fetchUser = async (): Promise<void> => {
      const { user } = await getUserById(userId);
      if (user) {
        setName(user.firstName + " " + user.lastName);
      }
    };
    const setAudioUrl = async () => {
      if (audio) {
        setUrl(audio);
      }
    };
    fetchUser();
    setAudioUrl();
  }, [userId, audio, setUrl]);

  return (
    <>
      <section className="gap-x-7.5 flex w-full  justify-between gap-y-2.5 bg-white-100 p-5 dark:bg-dark-800">
        <section className="ml-5 flex w-2/5 items-center ">
          <PlayCardImage image={image} />
        </section>
        <section className="flex w-3/5 flex-col gap-y-2  ">
          <div className="flex flex-col gap-y-2">
            <span className="paragraph-4-regular text-dark-800 dark:text-white-200">
              {title}
            </span>
            <span className="paragraph-1-bold text-dark-800 dark:text-white-200">
              by {name}
            </span>
          </div>
          <section className="flex w-full flex-col justify-between gap-y-2">
            {/* <FixedAudioPlayer /> */}
            <div>
              <Button
                onClick={() => {
                  setAudio(audio);
                  setOpen(true);
                }}
                className="flex h-9 w-[105px] content-center items-center justify-center bg-primary-500 max-lg:w-full"
              >
                {isPlaying ? <Pause /> : <Play />}
                <span>Play now</span>
              </Button>
            </div>
          </section>
        </section>
      </section>
    </>
  );
};

export default PlayCard;
