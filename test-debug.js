const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  // Login via API
  const apiContext = await context.request;
  const loginResp = await apiContext.post('https://rahulshettyacademy.com/api/ecom/auth/login', {
    data: { userEmail: 'anshika@gmail.com', userPassword: 'Iamking@000' }
  });
  const loginData = await loginResp.json();
  console.log('Login success:', !!loginData.token);

  // Inject token
  await page.goto('https://rahulshettyacademy.com/client');
  await page.evaluate((token) => localStorage.setItem('token', token), loginData.token);
  await page.goto('https://rahulshettyacademy.com/client');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Get cart page HTML structure first
  await page.goto('https://rahulshettyacademy.com/client/dashboard/dash');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // Add product to cart
  const addBtns = page.locator('.card-body button:last-of-type');
  await addBtns.first().click();
  await page.waitForTimeout(2000);

  // Go to cart
  await page.locator('[routerlink*="cart"]').click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Debug: print cart page HTML
  const html = await page.content();
  console.log('=== CART PAGE HTML ===');
  // Find cart related sections
  const cartHtml = await page.evaluate(() => {
    const cartSection = document.querySelector('.cartSection, .cart, .cart-items, .cart-page');
    return cartSection ? cartSection.innerHTML.substring(0, 3000) : 'No cart section found with class';
  });
  console.log(cartHtml);

  // Check what elements contain product info
  const allTexts = await page.evaluate(() => {
    const elements = document.querySelectorAll('h1, h2, h3, h4, .productName, .itemName, .product-name, b, strong, .cartSection *');
    return Array.from(elements).map(el => ({ tag: el.tagName, class: el.className, text: el.textContent?.trim() }));
  });
  console.log('\n=== ALL TEXT ELEMENTS ===');
  allTexts.forEach(t => {
    if (t.text) console.log(`${t.tag}.${t.class}: "${t.text}"`);
  });

  await browser.close();
})().catch(e => console.error(e));
