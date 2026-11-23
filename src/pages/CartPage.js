const { expect } = require('@playwright/test');
const Logger = require('../utils/logger');

class CartPage {
  constructor(page) {
    this.page = page;
    this.cartItems = page.locator('.cartSection h3');
    this.checkoutButton = page.locator('text=Checkout');
    this.totalPrice = page.locator('.totalPrice');
    this.removeButton = page.locator('.fa-trash');
  }

  async verifyProductInCart(productName) {
    await this.page.waitForSelector('.cartWrap', { timeout: 10000 });
    const items = await this.cartItems.allTextContents();
    const found = items.some(item => item.trim() === productName);
    expect(found).toBeTruthy();
    Logger.step(`Verified "${productName}" is in cart`);
  }

  async clickCheckout() {
    await this.checkoutButton.click();
    Logger.step('Clicked Checkout button');
    await this.page.waitForLoadState('networkidle');
  }
}

module.exports = CartPage;
