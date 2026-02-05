import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: {
      // This is to make the tests work with the @ import paths
      "@": path.resolve(__dirname, "."),
    },
  },
});
