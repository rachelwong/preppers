import type { AddressInfo } from "node:net";
import { StatusCodes } from "http-status-codes";
import { afterAll, expect, test } from "vitest";
import { app } from "./index.js";

afterAll(() => app.close());

// Drives the real Vercel entry over HTTP, not a test-built app.
test("Vercel entry serves health over HTTP", async () => {
  const { port } = app.server.address() as AddressInfo;
  const res = await fetch(`http://localhost:${port}/api/health`);

  expect(res.status).toBe(StatusCodes.OK);
  expect(await res.json()).toEqual({ status: "ok" });
});
