"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { middleHeaderIconList } from "@/lib/constants";
import CreateButton from "./CreateButton";

const HeaderNav = () => {
  const pathname = usePathname();

  return (
    <>
      {middleHeaderIconList.map((icon) => {
        const { icon: Icon, key } = icon;
        const isSelected = pathname.includes(key);
        return (
          <Link
            key={key}
            href={`/${key}`}
            className={
              isSelected
                ? "rounded-md bg-primary-500 p-3"
                : "rounded-md p-3 hover:bg-white-200 dark:hover:bg-dark-700"
            }
          >
            <Icon key={key} fill={isSelected ? "fill-white-100" : ""} />
          </Link>
        );
      })}
      <CreateButton />
    </>
  );
};

export default HeaderNav;
