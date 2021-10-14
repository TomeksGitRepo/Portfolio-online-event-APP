const withTM = require("next-transpile-modules")(["react-awesome-slider"]);

module.exports = withTM({
  reactStrictMode: true,
  eslint: {
    // Warning: Dangerously allow production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
});
