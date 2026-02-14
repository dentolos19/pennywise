import { useChat } from "ai/react";

export function useChatProxy() {
  return useChat({
    api: "/api/chat",
  });
}
