// Vercel Function entry (zero-config Fastify) and local `npm run dev`.
import { buildApp } from "./build-app.js";

const DEFAULT_PORT = 3000;

export const app = buildApp();

await app.listen({ port: Number(process.env.PORT ?? DEFAULT_PORT) });
