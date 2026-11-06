import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import boundaries from "eslint-plugin-boundaries";
import prettier from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

// Layers per AGENTS.md: routes/components → hooks → api. Each calls only the one below.
const LAYERS = [
  { type: "view", pattern: "src/routes" },
  { type: "view", pattern: "src/components" },
  { type: "view", pattern: "src/features" },
  { type: "hooks", pattern: "src/hooks" },
  { type: "api", pattern: "src/api" },
];

export default defineConfig(
  { ignores: ["dist", "coverage"] },
  js.configs.recommended,
  tseslint.configs.recommended,
  prettier,
  {
    languageOptions: { globals: globals.browser },
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
              from: { element: { type: "view" } },
              disallow: { to: { element: { type: "api" } } },
              message: "Views call hooks, never src/api.",
            },
            {
              from: { element: { type: "hooks" } },
              disallow: { to: { element: { type: "view" } } },
              message: "Hooks never import views.",
            },
            {
              from: { element: { type: "api" } },
              disallow: { to: { element: { types: ["view", "hooks"] } } },
              message: "src/api never imports layers above it.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["**/*.test.{ts,tsx}"],
    rules: { "@typescript-eslint/no-magic-numbers": "off" },
  },
);
