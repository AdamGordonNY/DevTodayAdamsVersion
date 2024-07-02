/* eslint-disable camelcase */
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  createUserFromHook,
  deleteUserFromHook,
  updateUserFromHook,
} from "@/lib/actions/onboarding.actions";
import { Platform } from "@prisma/client";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.NEXT_CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new SVIX instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  console.log("Webhook body:", JSON.parse(body));
  if (eventType === "user.created") {
    try {
      const {
        id,
        email_addresses,
        image_url,
        first_name,
        last_name,
        username,
      } = evt.data;

      const newUser = await createUserFromHook({
        clerkID: id,
        email: email_addresses[0].email_address,
        firstName: first_name || "first_name",
        lastName: last_name || "last_name",
        username: username || email_addresses[0].email_address.split("@")[0],
        image: image_url,
        onboardingStep: 1,
        level: "SeasonedPro",
        goal: "BuildPortfolio",
        SocialMedia: {
          createMany: {
            data: [
              {
                platform: Platform.LinkedIn,
                link: "https://linkedin.com/in/defaultuser",
                handle: "defaultuser",
              },
              {
                platform: Platform.Instagram,
                link: "https://instagram.com/defaultuser",
                handle: "defaultuser",
              },
              {
                platform: Platform.Twitter,
                link: "https://twitter.com/defaultuser",
                handle: "defaultuser",
              },
            ],
          },
        },
      });

      if (newUser) {
        return NextResponse.json({ message: "OK", newUser });
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (eventType === "user.updated") {
    const {
      id,
      email_addresses,
      image_url,
      first_name,
      last_name,
      username,
      public_metadata,
    } = evt.data;
    const { onboardingComplete } = public_metadata;
    if (onboardingComplete === true) {
      const user = await updateUserFromHook({
        clerkID: id,
        email: email_addresses[0].email_address,
        firstName: first_name,
        lastName: last_name,
        username,
        image: image_url,
      });
      return NextResponse.json({ message: "OK", user });
    } else {
      const user = await updateUserFromHook({
        clerkID: id,
        email: email_addresses[0].email_address,
        firstName: first_name,
        lastName: last_name,
        username,
        image: image_url,
      });
      return NextResponse.json({ message: "OK", user });
    }
  }

  if (eventType === "user.deleted") {
    const { id: clerkID } = evt.data;
    if (clerkID) {
      const deletedUser = await deleteUserFromHook(clerkID);
      if (deletedUser) {
        return NextResponse.json({ message: "OK", user: deletedUser });
      }
    }
  }

  return NextResponse.json({ message: "OK" });
}
