import React, { useEffect, useRef, useState, useTransition } from "react";
import { Loader2 } from "lucide-react";

const ScrollController = ({
  children,
  onScrollEnd,
  isScrollEnd,
}: {
  children: React.ReactNode;
  onScrollEnd: () => void;
  isScrollEnd: boolean;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isRunningRef = useRef(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const scrollRefCurr = scrollRef.current;
    if (!scrollRefCurr) return;

    const clientHeight = scrollRefCurr.clientHeight;
    const scrollHeight = scrollRefCurr.scrollHeight;

    const handleScroll = async () => {
      if (scrollRefCurr.scrollTop + clientHeight >= scrollHeight * 0.95) {
        if (isRunningRef.current) return;
        isRunningRef.current = true;
        setTimeout(() => {
          isRunningRef.current = false;
        }, 500);

        if (!isScrollEnd) {
          startTransition(async () => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            onScrollEnd();
          });
        }
      }
    };

    scrollRefCurr?.addEventListener("scroll", handleScroll);
    return () => {
      scrollRefCurr?.removeEventListener("scroll", handleScroll);
    };
  }, [isScrollEnd, onScrollEnd]);

  return (
    <div
      ref={scrollRef}
      className="scroll-controller size-full h-40 overflow-x-hidden overflow-y-visible scroll-smooth px-2"
    >
      {children}
      <section className="paragraph-3-regular m-2 flex justify-center text-dark-800 dark:text-white-200">
        {isPending ? (
          <Loader2 className="animate-spin" />
        ) : (
          <p>You've reached the end!</p>
        )}
      </section>
    </div>
  );
};

export default ScrollController;
