"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useClerk } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

import { clerkMenuItems } from "@/lib/constants";
import { Sun, Moon } from "../ui/icons";
import { Theme } from "@/lib/types.d";

const MenuItems = () => {
  const { signOut } = useClerk();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const handleMenuClick = (label: string) => {
    if (label === "Logout") {
      signOut(() => router.push("/sign-in"));
    } else {
      router.push("/profile");
    }
  };

  return (
    <section className="w-full  space-y-3" id="menu-items">
      {clerkMenuItems.map((menuItem) => {
        const { icon: Icon, label } = menuItem;
        return (
          <button
            key={label}
            onClick={() => handleMenuClick(label)}
            className="group flex items-center gap-x-4 pl-6"
          >
            <Icon className="fill-dark-800 group-hover:fill-primary-500 dark:fill-white-200" />
            <p className="paragraph-3-medium text-dark-800 group-hover:text-primary-500 dark:text-white-200">
              {label}
            </p>
          </button>
        );
      })}

      <div className="flex justify-center">
        <hr className="border-1 h-px  w-3/4 dark:border-dark-700" />
      </div>

      <div className="flex items-center justify-between gap-x-4 px-6 py-2 dark:bg-dark-800">
        <p className="heading-2-medium text-dark-800 dark:text-white-200">
          Interface
        </p>
        <div className="flex items-center rounded-3xl bg-white-200 p-0.5 dark:bg-dark-800">
          <button type="button" onClick={() => setTheme(Theme.LIGHT)}>
            <Sun isSelected={theme === Theme.LIGHT} />
          </button>
          <button type="button" onClick={() => setTheme(Theme.DARK)}>
            <Moon isSelected={theme === Theme.DARK} />
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        <hr className="border-1 h-px  w-3/4 dark:border-dark-700" />
      </div>
    </section>
  );
};

const ClerkMenuController = () => {
  const [anchor, setAnchor] = useState<Element>();

  useEffect(() => {
    const onClick = () => {
      const menu = document.querySelector(".cl-userButtonPopoverMain");
      if (!menu) return;

      setAnchor(menu);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
    };
  }, []);
  return <>{anchor && createPortal(<MenuItems />, anchor)}</>;
};

export default ClerkMenuController;
