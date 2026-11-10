const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  outputDir: './evidencia',
  reporter: [['list'], ['html', { outputFolder: 'reporte', open: 'never' }]],
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'on'
  },
  webServer: {
    command: 'npx http-server -p 3000 -s -c-1',
    url: 'http://localhost:3000',
    reuseExistingServer: true
  }
});
