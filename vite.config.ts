import { cloudflare } from "@cloudflare/vite-plugin";
import vinext from "vinext";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 3000,
    strictPort: true,
  },
  plugins: [
    vinext(),
    cloudflare({
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
  ],
  optimizeDeps: {
    include: ["prop-types", "react-is"],
    exclude: ["zod"],
  },
});
