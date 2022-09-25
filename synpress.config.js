import { defineConfig } from "cypress";
import setupNodeEvents from "@synthetixio/synpress/plugins/index";
import helpers from "@synthetixio/synpress/helpers";

const fixturesFolder = `${helpers.getSynpressPath()}/fixtures`;
const supportFile = "./cypress/support/e2e.ts";

export default defineConfig({
    userAgent: "synpress",

    retries: {
        runMode: 0,
        openMode: 0,
    },

    fixturesFolder,
    screenshotsFolder: "tests/e2e/screenshots",
    videosFolder: "tests/e2e/videos",
    chromeWebSecurity: true,
    viewportWidth: 1366,
    viewportHeight: 768,

    env: {
        coverage: false,
    },

    defaultCommandTimeout: 30000,
    pageLoadTimeout: 30000,
    requestTimeout: 30000,

    e2e: {
        setupNodeEvents,
        baseUrl: "http://127.0.0.1:5173",
        specPattern: "tests/e2e/**/**/*.{js,jsx,ts,tsx}",
        supportFile,
        env: {
            // https://github.com/bahmutov/cypress-slow-down
            commandDelay: 1000,
        },
    },

    component: {
        setupNodeEvents,
        specPattern: "tests/component/**/**/*cy.{js,jsx,ts,tsx}",
        supportFile,
    },

    component: {
        devServer: {
            framework: "svelte",
            bundler: "vite",
        },
    },
});
