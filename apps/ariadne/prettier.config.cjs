const root = require("../../prettier.config.cjs");

module.exports = {
  ...root,
  plugins: ["prettier-plugin-tailwindcss"],
};