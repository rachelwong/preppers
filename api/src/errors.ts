import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";
import { StatusCodes } from "http-status-codes";

// Every error response is { code, message, details? }. Codes are snake_case.
export const ErrorCode = {
  NotFound: "not_found",
  ValidationFailed: "validation_failed",
  BadRequest: "bad_request",
  Internal: "internal_error",
} as const;

// Thrown by services for expected failures, e.g. a bad status move → 409.
export class AppError extends Error {
  constructor(
    readonly status: StatusCodes,
    readonly code: string,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
  }
}

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (hasZodFastifySchemaValidationErrors(error)) {
    // "/items/0/qty" → "items.0.qty"
    const details = error.validation.map((issue) => ({
      path: issue.instancePath.slice(1).replaceAll("/", "."),
      message: issue.message,
    }));

    return reply.code(StatusCodes.BAD_REQUEST).send({
      code: ErrorCode.ValidationFailed,
      message: "Request is invalid",
      details,
    });
  }

  if (error instanceof AppError) {
    const { code, message, details } = error;

    return reply.code(error.status).send({ code, message, details });
  }

  // Fastify's own client errors, e.g. malformed JSON or body too large.
  // Other libraries' 4xx (e.g. Stripe) may hold personal data: they fall to 500.
  const status = error.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR;
  const isFastifyError = error.code?.startsWith("FST_") ?? false;
  const isClientError = status < StatusCodes.INTERNAL_SERVER_ERROR;

  if (isFastifyError && isClientError) {
    return reply
      .code(status)
      .send({ code: ErrorCode.BadRequest, message: error.message });
  }

  // Unknown: log it all, tell the client nothing.
  request.log.error({ err: error }, "Unhandled error");

  return reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
    code: ErrorCode.Internal,
    message: "Something went wrong",
  });
}
