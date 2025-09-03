import { NextResponse } from "next/server";
import prisma from "@/db";

// Simple in-memory (per lambda container) rate limiter for alert spam control
declare const globalThis: {
  __KEEPALIVE_LAST_ALERT__?: number;
} & typeof global;

async function sendAlert(message: string) {
  const webhook =
    process.env.KEEPALIVE_ALERT_WEBHOOK || process.env.SLACK_WEBHOOK_URL;
  if (!webhook) return; // No webhook configured

  const now = Date.now();
  const last = globalThis.__KEEPALIVE_LAST_ALERT__ || 0;
  // Minimum 5 minutes between alerts
  if (now - last < 5 * 60 * 1000) return;
  globalThis.__KEEPALIVE_LAST_ALERT__ = now;

  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `⚠️ Keep-Alive failure: ${message}`,
        source: "keep-alive-cron",
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (e) {
    console.error("Failed to send keep-alive alert", e);
  }
}

// Lightweight endpoint to keep the database connection warm.
// Scheduled by Vercel cron (see vercel.json). Runs a trivial query.
export async function GET() {
  const started = Date.now();
  try {
    // Very cheap no-op style query (always returns 0)
    await prisma.user.count({ where: { id: { lt: 0 } } });
    return NextResponse.json({ ok: true, ms: Date.now() - started });
  } catch (error: any) {
    const msg = error?.message ?? "Unknown error";
    // Fire-and-forget alert
    sendAlert(msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
