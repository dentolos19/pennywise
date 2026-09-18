import { createOpenAI } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText, type Message } from "ai";
import { env } from "cloudflare:workers";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const payload = await req.json();
  if (!payload || typeof payload !== "object" || !("messages" in payload) || !Array.isArray(payload.messages)) {
    return NextResponse.json({ error: "Messages must be an array." }, { status: 400 });
  }

  const messages = payload.messages as Message[];

  const openrouter = createOpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: env.OPENROUTER_API_KEY,
    headers: {
      "HTTP-Referer": env.OPENROUTER_REFERER || "",
      "X-OpenRouter-Title": env.OPENROUTER_TITLE || "",
    },
  });

  const result = await streamText({
    model: openrouter(env.OPENROUTER_MODEL || "openrouter/auto"),
    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse();
}
