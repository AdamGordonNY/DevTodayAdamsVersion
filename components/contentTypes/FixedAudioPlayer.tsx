"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import Play from "../ui/icons/Play";
import Pause from "../ui/icons/Pause";
import { useAudioContext } from "@/lib/context/AudioContext";
import { Volume2, X } from "lucide-react";
import { format } from "date-fns";
import MotionDiv from "../shared/MotionDiv";
import { AnimatePresence } from "framer-motion";

const FixedAudioPlayer = ({ className }: { className?: string }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const { url, open, setOpen, isPlaying, setIsPlaying } = useAudioContext();
  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  const calculateProgress = () => {
    if (duration === 0) return 0;
    return (currentTime / duration) * 100;
  };
  useEffect(() => {
    const audio = audioRef.current;

    const updateTime = () => {
      if (audio) {
        setCurrentTime(audio.currentTime);
      }
    };

    const setAudioData = () => {
      if (audio) {
        setDuration(audio.duration);
      }
    };
    const resetAudio = () => {
      if (audio) {
        audio.currentTime = 0;
        setIsPlaying(false);
        setCurrentTime(0);
      }
    };
    if (audio) {
      audio.addEventListener("timeupdate", updateTime);
      audio.addEventListener("loadedmetadata", setAudioData);
      audio.addEventListener("ended", resetAudio);
    }

    return () => {
      if (audio) {
        audio.removeEventListener("timeupdate", updateTime);
        audio.removeEventListener("loadedmetadata", setAudioData);
        audio.removeEventListener("ended", resetAudio);
      }
    };
  }, [audioRef, url, open, isPlaying, setIsPlaying]);
  const formatTime = (seconds: number) => {
    return format(new Date(seconds * 1000), "mm:ss");
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(event.target.value);
    setVolume(volume);
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  };

  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const progressBar = event.currentTarget;
      const newTime =
        (event.nativeEvent.offsetX / progressBar.offsetWidth) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  return (
    <AnimatePresence>
      {open && url && (
        <MotionDiv
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className={`audio-player ${className} bottom-0 w-full bg-white-200 max-md:bottom-[75px] dark:bg-dark-900 `}
        >
          <div className="w-full">
            <audio ref={audioRef} src={url} className="hidden" />
            <div className="progress-bar-container">
              <div className="progress-bar" onClick={handleProgressClick}>
                <div
                  className="progress-bar-filled"
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
            </div>
            <div className="audio-controls">
              <Button
                onClick={handlePlayPause}
                className="play-pause-button w-[100px] gap-x-2.5 bg-primary-500 p-2"
                aria-label={isPlaying ? "Pause audio" : "Play audio"}
              >
                {isPlaying ? <Pause /> : <Play />}
                {isPlaying ? "Pause" : "Play"}
              </Button>
              <div className="audio-timing ">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
              <div className="volume-control max-md:hidden">
                <Volume2 className="bg-transparent fill-white-100 max-md:hidden" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="volume-slider bg-primary-500 text-white-100 max-md:hidden"
                />
              </div>
              <Button
                onClick={() => setOpen(false)}
                aria-label="Close player"
                className="flex items-center justify-center bg-white-200 p-2 dark:bg-dark-900"
              >
                <X className="fill-dark-900 stroke-dark-900 dark:fill-white-100 dark:stroke-white-100" />
              </Button>
            </div>
          </div>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
};

export default FixedAudioPlayer;
