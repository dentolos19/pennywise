import { createOpenAI } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";
import { NextRequest } from "next/server";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const openrouter = createOpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY!,
    headers: {
      "HTTP-Referer": process.env.OPENROUTER_REFERER || "",
      "X-OpenRouter-Title": process.env.OPENROUTER_TITLE || "",
    },
  });

  const result = await streamText({
    model: openrouter(process.env.OPENROUTER_MODEL || "openrouter/auto"),
    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse();
}
