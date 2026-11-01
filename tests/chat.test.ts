import { expect, mock, test } from "bun:test";
import { parseUserInput } from "better-auth/db";

mock.module("cloudflare:workers", () => ({
  env: {
    BETTER_AUTH_SECRET: "test-secret-with-at-least-32-characters",
    BETTER_AUTH_URL: "http://localhost",
    DATABASE_URL: "postgresql://test:test@127.0.0.1:1/test",
  },
}));
const { POST } = await import("../src/app/(routes)/api/chat/route");
const { GET } = await import("../src/app/api/auth/[...all]/route");
const { getAuth } = await import("../src/lib/auth");

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
    expect(await response.json()).toEqual({ error: expect.any(String) });
  });
}

test("chat requires an authenticated session", async () => {
  const body = JSON.stringify({ messages: [{ id: "1", role: "user", parts: [{ type: "text", text: "hello" }] }] });
  const response = await POST(new Request("http://localhost/api/chat", { method: "POST", body }));
  expect(response.status).toBe(401);
});

test("auth does not accept client-supplied point balances", () => {
  const options = getAuth().options;
  expect(parseUserInput(options, { points: 9000 }, "create").points).toBe(0);
  expect(() => parseUserInput(options, { points: 9000 }, "update")).toThrow();
  expect(parseUserInput(options, { points: 0 }, "update")).not.toHaveProperty("points");
});

test("the auth route handles an unauthenticated session request", async () => {
  const response = await GET(new Request("http://localhost/api/auth/get-session"));
  expect(response.status).toBe(200);
  expect(await response.json()).toBeNull();
});
