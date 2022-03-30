const withPlugins = require('next-compose-plugins')
const withFonts = require('next-fonts')

/**
 * @type {import('next').NextConfig}
 */
module.exports = withPlugins([[withFonts]], {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
})
