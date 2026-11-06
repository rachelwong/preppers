import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import boundaries from "eslint-plugin-boundaries";
import prettier from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

// Layers per AGENTS.md: routes → services → db and integrations.
// Each calls only the one below.
const LAYERS = [
  { type: "routes", pattern: "src/routes" },
  { type: "services", pattern: "src/services" },
  { type: "db", pattern: "src/db" },
  { type: "integrations", pattern: "src/integrations" },
];

export default defineConfig(
  { ignores: ["dist", "coverage"] },
  js.configs.recommended,
  tseslint.configs.recommended,
  prettier,
  {
    languageOptions: { globals: globals.node },
    plugins: { boundaries },
    settings: {
      "boundaries/elements": LAYERS,
      "import/resolver": { typescript: true },
    },
    rules: {
      curly: ["error", "all"],
      "no-nested-ternary": "error",
      "id-length": ["error", { max: 30, properties: "never" }],
      "no-magic-numbers": "off",
      "@typescript-eslint/no-magic-numbers": [
        "error",
        {
          ignore: [-1, 0, 1],
          ignoreArrayIndexes: true,
          ignoreDefaultValues: true,
          ignoreEnums: true,
          ignoreNumericLiteralTypes: true,
        },
      ],
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "*", next: "return" },
        { blankLine: "always", prev: ["const", "let"], next: "*" },
        { blankLine: "any", prev: ["const", "let"], next: ["const", "let"] },
        { blankLine: "always", prev: "block-like", next: "*" },
      ],
      "boundaries/dependencies": [
        "error",
        {
          default: "allow",
          policies: [
            {
              from: { element: { type: "routes" } },
              disallow: { to: { element: { types: ["db", "integrations"] } } },
              message: "Routes call services, never db or integrations.",
            },
            {
              from: { element: { type: "services" } },
              disallow: { to: { element: { type: "routes" } } },
              message: "Services never import routes.",
            },
            {
              from: { element: { types: ["db", "integrations"] } },
              disallow: { to: { element: { types: ["routes", "services"] } } },
              message: "Db and integrations never import layers above them.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["**/*.test.ts"],
    rules: { "@typescript-eslint/no-magic-numbers": "off" },
  },
);
