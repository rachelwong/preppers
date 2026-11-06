import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

export const healthRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/health",
    {
      schema: {
        response: { [StatusCodes.OK]: z.object({ status: z.literal("ok") }) },
      },
    },
    async () => ({ status: "ok" as const }),
  );
};
