const { expect } = require('@playwright/test');
const Logger = require('../utils/logger');

class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.countryInput = page.locator('[placeholder*="Country"]');
    this.countryDropdown = page.locator('.ta-results');
    this.countryOptions = page.locator('.ta-results button');
    this.submitButton = page.locator('.action__submit');
    this.orderConfirmation = page.locator('.hero-primary');
    this.orderId = page.locator('.em-spacer-1 .ng-star-inserted');
  }

  async selectCountry(countryName) {
    await this.countryInput.pressSequentially(countryName);
    Logger.step(`Typed country: ${countryName}`);
    await this.page.waitForSelector('.ta-results', { timeout: 5000 });
    const options = await this.countryOptions.allTextContents();
    for (let i = 0; i < options.length; i++) {
      if (options[i].trim() === countryName) {
        await this.countryOptions.nth(i).click();
        Logger.step(`Selected country: ${countryName}`);
        break;
      }
    }
  }

  async placeOrder() {
    await this.submitButton.click();
    Logger.step('Clicked Place Order button');
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);
  }

  async verifyOrderSuccess() {
    await expect(this.orderConfirmation).toBeVisible();
    const message = await this.orderConfirmation.textContent();
    Logger.info(`Order confirmation message: ${message.trim()}`);
    return message.trim();
  }

  async getOrderId() {
    if (await this.orderId.isVisible()) {
      const text = await this.orderId.textContent();
      return text.trim();
    }
    return null;
  }
}

module.exports = CheckoutPage;
