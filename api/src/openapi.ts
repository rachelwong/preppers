// `npm run openapi`: writes openapi.json, the contract web generates its types from.
import { writeFile } from "node:fs/promises";
import { buildApp } from "./build-app.js";

const JSON_INDENT = 2;

const app = buildApp();

await app.ready();
await writeFile(
  "openapi.json",
  `${JSON.stringify(app.swagger(), null, JSON_INDENT)}\n`,
);
await app.close();
