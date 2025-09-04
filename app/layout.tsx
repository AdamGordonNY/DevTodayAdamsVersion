import "./globals.css";
import type { Metadata } from "next";
// eslint-disable-next-line camelcase
import { IBM_Plex_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import React from "react";
import { Toaster } from "react-hot-toast";

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["500", "400", "700"],
});
export const metadata: Metadata = {
  title: "Dev Today - For Developers, By Developers",
  description:
    "Social media platform for developers to share information, connect, and learn from each other.",
  icons: {
    icon: "/faviconLight.svg",
  },
  generator: "nextjs, developer social media, ",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://devtoday.adam-gordon.info",
    description: "A Developer Focused Social Media site",
    siteName: "Dev Today",
    images: [
      {
        url: "/logoLight.svg",
        width: 640,
        height: 480,
        alt: "Dev Today",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      afterSignInUrl="/"
      afterSignUpUrl="/onboarding"
      appearance={{
        layout: {
          socialButtonsVariant: "iconButton",
          logoPlacement: "inside",
        },

        elements: {
          formFieldInput: {
            backgroundColor: "#393E4F",
            "&:focus": {
              borderColor: "#825EF6",
            },
          },

          socialButtons: {
            alignItems: "middle",
            justifyContent: "left",
            display: "flex",
            gap: "10px",
            flex: "1",
            flexDirection: "row",
            flexFlow: "row",
          },
          socialButtonsIconButton: {
            border: "1px solid #393E4F",
            width: "55px",
            height: "55px",
          },
          dividerLine: {
            display: "none",
          },
          dividerText: {
            display: "none",
          },
          formHeaderSubtitle: {
            color: "gray",
          },
          formFieldLabel: {
            color: "white",
          },
          formButtonPrimary: {
            backgroundColor: "#825EF6",
            textAlign: "center",
            color: "white-100",
          },

          headerTitle: {
            color: "white",
          },
          headerSubtitle: {
            color: "white",
          },
          card: {
            justifyContent: "center",
            alignContent: "center",
            backgroundColor: "#1F2128",
          },
          rootBox: {
            padding: "60px",
            width: "496px",
            height: "780px",
            color: "white",
          },
          formFieldHintText: {
            color: "gray",
          },
          footerActionText: {
            color: "white",
          },
          footerActionLink: {
            color: "#825EF6",
          },
          header: {
            color: "white",
          },
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={plex.className}>
          {/* Skip link for keyboard users */}
          <a
            href="#main-content"
            className="focus:text-white sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-primary-500 focus:px-4 focus:py-2"
          >
            Skip to main content
          </a>
          <ThemeProvider>{children}</ThemeProvider>
          <Toaster position="bottom-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
