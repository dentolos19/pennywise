import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export function useChatProxy() {
  return useChat({ transport: new DefaultChatTransport({ api: "/api/chat" }) });
}
