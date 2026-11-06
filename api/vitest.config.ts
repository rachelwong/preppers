import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { env: { LOG_LEVEL: "silent", PORT: "0" } },
});
