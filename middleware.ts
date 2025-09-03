import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/posts",
  "/meetups",
  "/podcasts",
  "/groups",
  "/api/webhooks",
  "/onboarding",
  "/api/uploadthing",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/groups/22",
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, sessionClaims } = await auth();

  // Allow onboarding page to load without redirects once signed in
  if (req.nextUrl.pathname === "/onboarding") {
    return NextResponse.next();
  }

  // If route is not public, protect it
  if (!isPublicRoute(req)) {
    if (!userId) {
      return (await auth()).redirectToSignIn({ returnBackUrl: req.url });
    }

    // Redirect signed-in users who have not completed onboarding
    if (!sessionClaims?.metadata?.onboardingComplete) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }
  }

  // Public or authorized route
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
