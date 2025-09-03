import { currentUser } from "@clerk/nextjs/server";

import Link from "next/link";
import Image from "next/image";

import logoLight from "@/public/logoLight.svg";
import logoDark from "@/public/logoDark.svg";
import ClerkMenuController from "./ClerkMenuController";
import HeaderNav from "./HeaderNav";
import UserButtonNav from "./UserButtonNav";
import NotificationsMenu from "./NotificationsMenu";
import Search from "./Search";

const Header = async () => {
  // Clerk User
  const user = await currentUser();

  return (
    <>
      <header className="sticky flex h-20 items-center justify-between bg-white-100 px-8 dark:bg-dark-800">
        <Image
          priority
          src={logoLight}
          alt="LogoLight"
          className="-mt-1.5 block dark:hidden"
        />

        <Image
          priority
          src={logoDark}
          alt="LogoDark"
          className="-mt-1.5 hidden dark:block"
        />

        <section className="flex gap-x-7 px-3 max-md:hidden">
          <HeaderNav />
        </section>

        <section className="flex items-center gap-x-4">
          <div className="rounded-md bg-white-200 p-3 dark:bg-dark-700">
            <Search />
          </div>

          <NotificationsMenu userId={user?.id ?? ""} />

          {user ? (
            <UserButtonNav />
          ) : (
            <Link
              href="/sign-in"
              className="rounded bg-white-200 hover:bg-primary-500 dark:bg-dark-700"
            >
              <p className="paragraph-2-medium p-3 text-dark-700 hover:text-white-100 dark:text-white-300">
                Sign In
              </p>
            </Link>
          )}
        </section>
      </header>

      {/* MOBILE VIEW */}
      <footer className="fixed bottom-0 z-20 flex h-20 w-full items-center justify-between bg-white-100 px-8 md:hidden dark:bg-dark-800">
        <HeaderNav />
      </footer>

      <ClerkMenuController />
    </>
  );
};

export default Header;
