const adonis = require("@adonisjs/prettier-config");

module.exports = {
  ...adonis,
  plugins: [...adonis.plugins, "prettier-plugin-tailwindcss"],
};
