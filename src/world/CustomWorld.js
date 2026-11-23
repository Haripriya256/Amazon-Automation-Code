const { World, setWorldConstructor } = require('@cucumber/cucumber');
const { chromium } = require('playwright');
const ApiClient = require('../api/ApiClient');
const LoginPage = require('../pages/LoginPage');
const DashboardPage = require('../pages/DashboardPage');
const CartPage = require('../pages/CartPage');
const CheckoutPage = require('../pages/CheckoutPage');
const DataReader = require('../utils/dataReader');

class CustomWorld extends World {
  constructor(options) {
    super(options);
    this.context = null;
    this.page = null;
    this.browser = null;
    this.apiClient = new ApiClient();
    this.loginPage = null;
    this.dashboardPage = null;
    this.cartPage = null;
    this.checkoutPage = null;
    this.testData = DataReader.getTestData();
    this.user = null;
    this.selectedProduct = null;
    this.orderId = null;
  }

  async init() {
    this.browser = await chromium.launch({ headless: true });
    this.context = await this.browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    this.page = await this.context.newPage();

    this.loginPage = new LoginPage(this.page);
    this.dashboardPage = new DashboardPage(this.page);
    this.cartPage = new CartPage(this.page);
    this.checkoutPage = new CheckoutPage(this.page);

    await this.apiClient.init();
  }

  async close() {
    try {
      if (this.page) await this.page.close();
      if (this.context) await this.context.close();
      if (this.browser) await this.browser.close();
      await this.apiClient.dispose();
    } catch (e) {
      // ignore close errors
    }
  }
}

setWorldConstructor(CustomWorld);

module.exports = CustomWorld;
