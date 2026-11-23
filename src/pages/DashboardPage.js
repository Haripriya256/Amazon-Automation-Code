const { expect } = require('@playwright/test');
const Logger = require('../utils/logger');

class DashboardPage {
  constructor(page) {
    this.page = page;
    this.productCards = page.locator('.card-body');
    this.productNames = page.locator('.card-body b');
    this.addToCartButtons = page.locator('.card-body button:last-of-type');
    this.cartIcon = page.locator('[routerlink*="cart"]');
    this.toastMessage = page.locator('#toast-container');
    this.spinner = page.locator('.ng-animating');
  }

  async waitForProducts() {
    await this.page.waitForSelector('.card-body', { timeout: 15000 });
    Logger.info('Products loaded on dashboard');
  }

  async addProductToCart(productName) {
    const count = await this.productNames.count();
    let added = false;
    for (let i = 0; i < count; i++) {
      const name = await this.productNames.nth(i).textContent();
      if (name.trim() === productName) {
        await this.addToCartButtons.nth(i).click();
        Logger.step(`Clicked Add to Cart for: ${productName}`);
        added = true;
        break;
      }
    }
    if (!added) {
      throw new Error(`Product "${productName}" not found on dashboard`);
    }
    await this.page.waitForTimeout(1000);
  }

  async clickCart() {
    await this.cartIcon.click();
    Logger.step('Clicked on cart icon');
    await this.page.waitForLoadState('networkidle');
  }

  async verifyProductVisible(productName) {
    await expect(this.page.locator('.card-body', { hasText: productName })).toBeVisible();
  }
}

module.exports = DashboardPage;
