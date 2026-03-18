import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: false,
    include: ["__tests__/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["__tests__/**/*.ts"],
      exclude: ["__tests__/**/*.test.ts", "__tests__/**/*.spec.ts"],
    },
  },
});
