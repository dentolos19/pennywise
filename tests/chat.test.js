import { expect, mock, test } from "bun:test";

mock.module("cloudflare:workers", () => ({ env: {} }));
const { POST } = await import("../src/app/(routes)/api/chat/route");

for (const [name, body] of [
  ["malformed JSON", "{"],
  ["missing messages", "{}"],
  [
    "invalid message parts",
    JSON.stringify({ messages: [{ id: "1", role: "user", parts: [{ type: "text", text: 42 }] }] }),
  ],
  ["invalid message role", JSON.stringify({ messages: [{ id: "1", role: "admin", parts: [] }] })],
]) {
  test(`chat rejects ${name} before contacting the AI provider`, async () => {
    const response = await POST(new Request("http://localhost/api/chat", { method: "POST", body }));
    expect(response.status).toBe(400);
    expect((await response.json()).error).toBeString();
  });
}
