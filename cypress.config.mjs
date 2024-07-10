import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    specPattern: 'src/tests/e2e/**/*.cy.{js,jsx,ts,tsx}',
    // supportFile: 'tests/e2e/support/e2e.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

