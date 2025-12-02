import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "react/no-unescaped-entities": "off",
      "no-console": "off",
      "react/prop-types": "off",
      "no-unused-vars": "off",
      "react/react-in-jsx-scope": "off",
      "react/no-unknown-property": "off",
      "jsx-a11y/anchor-is-valid": "off",
    },
  },

  {
    ignores: ["**/*"],
  },
];

export default eslintConfig;
