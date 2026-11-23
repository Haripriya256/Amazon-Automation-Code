const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const DataReader = require('../../src/utils/dataReader');
const Logger = require('../../src/utils/logger');

Given('I am a registered user with valid credentials', async function () {
  this.user = DataReader.getUserByScenario('valid_user');
  if (!this.user) {
    throw new Error('No valid user found in test-data/users.json');
  }
  Logger.info(`Using user: ${this.user.userEmail}`);
});

When('I login to the application', async function () {
  await this.loginPage.goto();
  await this.loginPage.login(this.user.userEmail, this.user.userPassword);
});

When('I login via API and inject token into browser', async function () {
  const result = await this.apiClient.login(this.user.userEmail, this.user.userPassword);
  expect(result.status).toBe(200);
  await this.loginPage.loginWithApiToken(result.body.token);
});

When('I login via API', async function () {
  const result = await this.apiClient.login(this.user.userEmail, this.user.userPassword);
  expect(result.status).toBe(200);
  this.authToken = result.body.token;
  this.userId = result.body.userId;
  Logger.info(`API token received: ${this.authToken.substring(0, 20)}...`);
});

Then('I should receive a valid authentication token', async function () {
  expect(this.authToken).toBeTruthy();
  Logger.info('Authentication token validated');
});

Then('I should see the dashboard with products', async function () {
  await this.dashboardPage.waitForProducts();
});

When('I add product {string} to the cart', async function (productName) {
  this.selectedProduct = productName;
  await this.dashboardPage.addProductToCart(productName);
});

When('I navigate to the cart', async function () {
  await this.dashboardPage.clickCart();
});

Then('I should see {string} in the cart', async function (productName) {
  await this.cartPage.verifyProductInCart(productName);
});

When('I proceed to checkout', async function () {
  await this.cartPage.clickCheckout();
});

When('I select country {string}', async function (countryName) {
  await this.checkoutPage.selectCountry(countryName);
});

When('I place the order', async function () {
  await this.checkoutPage.placeOrder();
});

Then('I should see the order confirmation message {string}', async function (expectedMessage) {
  const actualMessage = await this.checkoutPage.verifyOrderSuccess();
  expect(actualMessage).toContain(expectedMessage);
  this.orderId = await this.checkoutPage.getOrderId();
  Logger.info(`Order placed successfully. Order ID: ${this.orderId}`);
});

When('I fetch all products via API', async function () {
  const result = await this.apiClient.getAllProducts();
  expect(result.status).toBe(200);
  this.productList = result.body.data;
});

Then('I should see products in the response', async function () {
  expect(this.productList.length).toBeGreaterThan(0);
  Logger.info(`Total products available: ${this.productList.length}`);
});

When('I create an order via API for product {string}', async function (productName) {
  const result = await this.apiClient.getAllProducts();
  const product = result.body.data.find(p => p.productName === productName);
  if (!product) {
    throw new Error(`Product "${productName}" not found via API`);
  }
  this.selectedProductId = product._id;

    const orderResult = await this.apiClient.createOrder(
      [{ country: 'India', productOrderedId: product._id }]
    );
  expect(orderResult.status).toBe(201);
  this.createdOrderId = orderResult.body.orders?.[0];
  Logger.info(`Order created: ${this.createdOrderId}`);
});

Then('the order should be created successfully', async function () {
  expect(this.createdOrderId).toBeTruthy();
  Logger.info(`Order ID: ${this.createdOrderId}`);
});

When('I fetch orders via API', async function () {
  const result = await this.apiClient.getOrders();
  expect(result.status).toBe(200);
  this.myOrders = result.body.data;
});

Then('I should see the created order in the list', async function () {
  const found = this.myOrders.some(order => order._id === this.createdOrderId);
  expect(found).toBeTruthy();
  Logger.info('Created order found in order list');
});
