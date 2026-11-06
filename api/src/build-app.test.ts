import { StatusCodes } from "http-status-codes";
import { expect, test } from "vitest";
import { z } from "zod";
import { buildApp } from "./build-app.js";
import { AppError } from "./errors.js";

test("health returns ok", async () => {
  const app = buildApp();
  const res = await app.inject({ method: "GET", url: "/api/health" });

  expect(res.statusCode).toBe(StatusCodes.OK);
  expect(res.json()).toEqual({ status: "ok" });
});

test("unknown route returns 404 in error format", async () => {
  const app = buildApp();
  const res = await app.inject({ method: "GET", url: "/api/nope" });

  expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
  expect(res.json()).toEqual({ code: "not_found", message: "Route not found" });
});

test("invalid body returns 400 with field details", async () => {
  const app = buildApp();

  app.post(
    "/api/echo",
    { schema: { body: z.object({ name: z.string() }) } },
    async () => ({}),
  );

  const res = await app.inject({
    method: "POST",
    url: "/api/echo",
    payload: {},
  });

  expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
  expect(res.json()).toEqual({
    code: "validation_failed",
    message: "Request is invalid",
    details: [{ path: "name", message: expect.any(String) }],
  });
});

test("AppError returns its status, code and details", async () => {
  const app = buildApp();

  app.get("/api/conflict", async () => {
    throw new AppError(StatusCodes.CONFLICT, "bad_move", "Can't do that now", {
      from: "hidden",
    });
  });

  const res = await app.inject({ method: "GET", url: "/api/conflict" });

  expect(res.statusCode).toBe(StatusCodes.CONFLICT);
  expect(res.json()).toEqual({
    code: "bad_move",
    message: "Can't do that now",
    details: { from: "hidden" },
  });
});

test("unexpected error returns 500 without leaking details", async () => {
  const app = buildApp();

  app.get("/api/boom", async () => {
    throw new Error("secret db detail");
  });

  const res = await app.inject({ method: "GET", url: "/api/boom" });

  expect(res.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
  expect(res.json()).toEqual({
    code: "internal_error",
    message: "Something went wrong",
  });
  expect(res.body).not.toContain("secret");
});

test("malformed JSON returns 400, not 500", async () => {
  const app = buildApp();

  app.post("/api/echo", async () => ({}));

  const res = await app.inject({
    method: "POST",
    url: "/api/echo",
    headers: { "content-type": "application/json" },
    payload: "{oops",
  });

  expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
  expect(res.json()).toEqual({
    code: "bad_request",
    message: expect.any(String),
  });
});

test("echoes an incoming request ID", async () => {
  const app = buildApp();
  const res = await app.inject({
    method: "GET",
    url: "/api/health",
    headers: { "x-request-id": "abc-123" },
  });

  expect(res.headers["x-request-id"]).toBe("abc-123");
});

test("generates a request ID when none is sent", async () => {
  const app = buildApp();
  const res = await app.inject({ method: "GET", url: "/api/health" });

  expect(res.headers["x-request-id"]).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
  );
});

test("library error with a 4xx statusCode still returns a safe 500", async () => {
  const app = buildApp();

  app.get("/api/stripe", async () => {
    throw Object.assign(new Error("card for cus_123 declined"), {
      statusCode: 402,
    });
  });

  const res = await app.inject({ method: "GET", url: "/api/stripe" });

  expect(res.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
  expect(res.body).not.toContain("cus_123");
});

test("Fastify server error returns a safe 500", async () => {
  const app = buildApp();

  app.get("/api/fst", async () => {
    throw Object.assign(new Error("internal plugin detail"), {
      code: "FST_ERR_SOMETHING",
      statusCode: 500,
    });
  });

  const res = await app.inject({ method: "GET", url: "/api/fst" });

  expect(res.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
  expect(res.body).not.toContain("plugin detail");
});
