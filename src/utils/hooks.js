const { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } = require('@cucumber/cucumber');
const Logger = require('./logger');

setDefaultTimeout(60000);

BeforeAll(async function () {
  Logger.info('=== Test Suite Execution Started ===');
});

Before(async function (scenario) {
  Logger.info(`=== Scenario: ${scenario.pickle.name} ===`);
  await this.init();
});

After(async function (scenario) {
  if (scenario.result && scenario.result.status === Status.FAILED && this.page) {
    try {
      const screenshot = await this.page.screenshot({
        path: `reports/screenshots/${scenario.pickle.name.replace(/\s+/g, '_')}_${Date.now()}.png`,
        fullPage: true
      });
      if (typeof this.attach === 'function') {
        this.attach(screenshot, 'image/png');
      }
    } catch (e) {
      Logger.error(`Screenshot failed: ${e.message}`);
    }
    Logger.error(`Scenario FAILED: ${scenario.pickle.name}`);
  } else if (scenario.result && scenario.result.status === Status.PASSED) {
    Logger.info(`Scenario PASSED: ${scenario.pickle.name}`);
  }
  await this.close();
});

AfterAll(async function () {
  Logger.info('=== Test Suite Execution Completed ===');
});
