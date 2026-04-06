const withNextIntl = require('next-intl/plugin')();

module.exports = withNextIntl({
  experimental: {
    serverComponentsExternalPackages: ['@react-pdf/renderer']
  }
});
