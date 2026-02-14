import { useChat } from "ai/react";

export function useChatProxy(apiKey: string) {
  return useChat({
    api: "/api/chat",
    fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
      return fetch(input, {
        ...init,
        headers: {
          ...init?.headers,
          "x-api-key": apiKey,
        },
      });
    },
  });
}
