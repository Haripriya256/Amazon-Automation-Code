const { request } = require('playwright');
const DataReader = require('../utils/dataReader');
const Logger = require('../utils/logger');

class ApiClient {
  constructor() {
    this.apiContext = null;
    this.token = null;
    this.userId = null;
    this.baseURL = DataReader.getBaseUrl();
  }

  async init() {
    this.apiContext = await request.newContext({
      baseURL: this.baseURL,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
      }
    });
    Logger.info('API context initialized');
  }

  _authHeaders() {
    return { 'authorization': this.token };
  }

  async login(userEmail, userPassword) {
    const endpoints = DataReader.getApiEndpoints();
    const response = await this.apiContext.post(endpoints.login, {
      data: { userEmail, userPassword }
    });
    const responseBody = await response.json();
    if (response.ok()) {
      this.token = responseBody.token;
      this.userId = responseBody.userId;
      Logger.info(`API Login successful. Token obtained.`);
    } else {
      Logger.error(`API Login failed: ${responseBody.message}`);
    }
    return { status: response.status(), body: responseBody };
  }

  async getAllProducts() {
    const endpoints = DataReader.getApiEndpoints();
    const response = await this.apiContext.post(endpoints.getAllProducts, {
      headers: this._authHeaders()
    });
    const text = await response.text();
    let responseBody;
    try {
      responseBody = JSON.parse(text);
    } catch (e) {
      responseBody = { data: null, message: text };
    }
    Logger.info(`Fetched ${responseBody.data?.length || 0} products via API`);
    return { status: response.status(), body: responseBody };
  }

  async addToCart(productId, quantity = 1) {
    const endpoints = DataReader.getApiEndpoints();
    const response = await this.apiContext.post(endpoints.addToCart, {
      headers: this._authHeaders(),
      data: {
        productId,
        quantity
      }
    });
    const responseBody = await response.json();
    Logger.info(`Add to cart API response: ${responseBody.message}`);
    return { status: response.status(), body: responseBody };
  }

  async createOrder(orders) {
    const endpoints = DataReader.getApiEndpoints();
    const response = await this.apiContext.post(endpoints.createOrder, {
      headers: this._authHeaders(),
      data: {
        orders
      }
    });
    const responseBody = await response.json();
    Logger.info(`Order created via API: ${responseBody.message}`);
    return { status: response.status(), body: responseBody };
  }

  async getOrders() {
    const endpoints = DataReader.getApiEndpoints();
    const url = `${endpoints.getOrders}/${this.userId}`;
    const response = await this.apiContext.get(url, {
      headers: this._authHeaders()
    });
    const text = await response.text();
    let responseBody;
    try {
      responseBody = JSON.parse(text);
    } catch (e) {
      responseBody = { data: null, message: text };
    }
    Logger.info(`Fetched ${responseBody.data?.length || 0} orders via API`);
    return { status: response.status(), body: responseBody };
  }

  async dispose() {
    if (this.apiContext) {
      await this.apiContext.dispose();
    }
  }
}

module.exports = ApiClient;
