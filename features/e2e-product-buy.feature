Feature: End-to-End Product Purchase

  As a customer of Rahul Shetty E-commerce
  I want to be able to browse products and purchase them
  So that I can complete my shopping successfully

  @Regression @E2E
  Scenario: User logs in, adds a product to cart and completes purchase successfully
    Given I am a registered user with valid credentials
    When I login to the application
    Then I should see the dashboard with products

    When I add product "ADIDAS ORIGINAL" to the cart
    And I navigate to the cart
    Then I should see "ADIDAS ORIGINAL" in the cart

    When I proceed to checkout
    And I select country "India"
    And I place the order
    Then I should see the order confirmation message "Thankyou for the order."

  @Smoke @E2E
  Scenario: User logs in via API and buys a product through UI
    Given I am a registered user with valid credentials
    When I login via API and inject token into browser
    Then I should see the dashboard with products

    When I add product "ZARA COAT 3" to the cart
    And I navigate to the cart
    Then I should see "ZARA COAT 3" in the cart

    When I proceed to checkout
    And I select country "India"
    And I place the order
    Then I should see the order confirmation message "Thankyou for the order."

  @Regression @API
  Scenario: Verify API endpoints are working
    Given I am a registered user with valid credentials
    When I login via API
    Then I should receive a valid authentication token

    When I fetch all products via API
    Then I should see products in the response

    When I create an order via API for product "ADIDAS ORIGINAL"
    Then the order should be created successfully

    When I fetch orders via API
    Then I should see the created order in the list
