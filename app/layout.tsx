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
          <ThemeProvider>{children}</ThemeProvider>
          <Toaster position="bottom-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
