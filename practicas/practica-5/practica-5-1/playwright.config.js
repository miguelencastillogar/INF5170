// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [

    // ========================================================
    // PROYECTO UI - CHROMIUM
    // ========================================================
    {
        name: 'ui-chromium',

        // Este proyecto ejecutará las pruebas de interfaz
        // utilizando Chromium.
        use: {
            ...devices['Desktop Chrome'],
        },

        // Solo ejecutará archivos ubicados dentro de tests/ui.
        testMatch: /tests\/ui\/.*\.spec\.js/,
    },


    // ========================================================
    // PROYECTO UI - FIREFOX
    // ========================================================
    {
        name: 'ui-firefox',

        // Este proyecto ejecutará las pruebas de interfaz
        // utilizando Firefox.
        use: {
            ...devices['Desktop Firefox'],
        },

        // Solo ejecutará las pruebas de la carpeta UI.
        testMatch: /tests\/ui\/.*\.spec\.js/,
    },


    // ========================================================
    // PROYECTO UI - WEBKIT
    // ========================================================
    {
        name: 'ui-webkit',

        // Este proyecto ejecutará las pruebas de interfaz
        // utilizando WebKit.
        use: {
            ...devices['Desktop Safari'],
        },

        // Solo ejecutará las pruebas de la carpeta UI.
        testMatch: /tests\/ui\/.*\.spec\.js/,
    },


    // ========================================================
    // PROYECTO API
    // ========================================================
    {
        name: 'api',

        // Este proyecto solamente ejecutará las pruebas
        // ubicadas dentro de tests/api.
        testMatch: /tests\/api\/.*\.spec\.js/,
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});

