const { expect } = require('@playwright/test');
const Logger = require('../utils/logger');


class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('#userEmail');
    this.passwordInput = page.locator('#userPassword');
    this.loginButton = page.locator('#login');
    this.errorMessage = page.locator('.invalid-feedback');
    this.loginTitle = page.locator('.login-title');
  }

  async goto() {
    await this.page.goto('https://rahulshettyacademy.com/client');
    await this.page.waitForLoadState('networkidle');
    Logger.info('Navigated to login page');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    Logger.step(`Entered email: ${email}`);
    await this.passwordInput.fill(password);
    Logger.step('Entered password');
    await this.loginButton.click();
    Logger.step('Clicked login button');
    await this.page.waitForLoadState('networkidle');
  }

  async loginWithApiToken(token) {
    await this.page.goto('https://rahulshettyacademy.com/client');
    await this.page.evaluate((t) => {
      localStorage.setItem('token', t);
    }, token);
    await this.page.goto('https://rahulshettyacademy.com/client');
    await this.page.waitForLoadState('networkidle');
    Logger.info('Logged in via API token in localStorage');
  }

  async verifyLoginError() {
    await expect(this.errorMessage).toBeVisible();
    Logger.info('Login error is visible');
  }
}

module.exports = LoginPage;
