const fs = require('fs');
const path = require('path');

class DataReader {
  static getTestData() {
    const filePath = path.join(process.cwd(), 'test-data', 'testData.json');
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  static getUsers() {
    const filePath = path.join(process.cwd(), 'test-data', 'users.json');
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  static getUserByScenario(scenarioName) {
    const users = this.getUsers();
    return users.find(u => u.scenario === scenarioName);
  }

  static getApiEndpoints() {
    return this.getTestData().apiEndpoints;
  }

  static getBaseUrl() {
    return this.getTestData().baseUrl;
  }

  static getClientUrl() {
    return this.getTestData().clientUrl;
  }
}

module.exports = DataReader;
