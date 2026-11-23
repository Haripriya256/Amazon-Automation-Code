module.exports = {
  default: {
    require: [
      "src/world/CustomWorld.js",
      "src/utils/hooks.js",
      "features/step_definitions/*.js"
    ],
    format: [
      "progress",
      "allure-cucumberjs/reporter",
      "json:reports/cucumber-report.json",
      "html:reports/cucumber-report.html"
    ],
    formatOptions: {
      snippetInterface: "async-await"
    },
    parallel: 1,
    timeout: 60000
  }
};
