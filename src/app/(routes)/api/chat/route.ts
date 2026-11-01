import { createOpenAI } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  validateUIMessages,
} from "ai";
import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";

import { getAuth } from "@/lib/auth";

export const maxDuration = 30;

export async function POST(req: Request) {
  let payload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  if (!payload || typeof payload !== "object" || !("messages" in payload) || !Array.isArray(payload.messages)) {
    return NextResponse.json({ error: "Messages must be an array." }, { status: 400 });
  }

  let messages;
  try {
    messages = await validateUIMessages({ messages: payload.messages });
  } catch {
    return NextResponse.json({ error: "Invalid chat messages." }, { status: 400 });
  }

  const session = await getAuth().api.getSession({ headers: req.headers });
  if (!session?.user?.id) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const openrouter = createOpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: env.OPENROUTER_API_KEY,
    headers: {
      "HTTP-Referer": env.OPENROUTER_REFERER || "",
      "X-OpenRouter-Title": env.OPENROUTER_TITLE || "",
    },
  });

  const result = await streamText({
    model: openrouter.chat(env.OPENROUTER_MODEL || "openrouter/auto"),
    messages: await convertToModelMessages(messages),
  });

  return createUIMessageStreamResponse({ stream: toUIMessageStream({ stream: result.stream }) });
}
