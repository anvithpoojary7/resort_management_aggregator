const { alias } = require("react-app-alias");

module.exports = function override(config) {
  alias({
    "@": "src"  // this means "@/components" will map to "src/components"
  })(config);

  return config;
};
