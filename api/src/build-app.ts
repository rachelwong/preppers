import { randomUUID } from "node:crypto";
import swagger from "@fastify/swagger";
import Fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { StatusCodes } from "http-status-codes";
import { ErrorCode, errorHandler } from "./errors.js";
import { healthRoutes } from "./routes/health.js";

// Shared with web and Sentry (0.5) to tie one request's logs together.
const REQUEST_ID_HEADER = "x-request-id";

export function buildApp() {
  const app = Fastify({
    logger: { level: process.env.LOG_LEVEL ?? "info" },
    requestIdHeader: REQUEST_ID_HEADER,
    genReqId: () => randomUUID(),
  }).withTypeProvider<ZodTypeProvider>();

  app.addHook("onRequest", async (request, reply) => {
    reply.header(REQUEST_ID_HEADER, request.id);
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.setErrorHandler(errorHandler);
  app.setNotFoundHandler((_request, reply) =>
    reply
      .code(StatusCodes.NOT_FOUND)
      .send({ code: ErrorCode.NotFound, message: "Route not found" }),
  );

  // Collects route schemas for `npm run openapi`. Serves no route.
  app.register(swagger, {
    openapi: { info: { title: "Preppers API", version: "0.0.0" } },
    transform: jsonSchemaTransform,
  });

  app.register(healthRoutes, { prefix: "/api" });

  return app;
}
