Feature: View Stock Details in Portfolio
  As a user of Fred,
  I would like to view, for each stock in my portfolio, the ticker symbol, the price I bought for, the price now, number of shares, and profit,
  So that I can see how much money I made.

  Background:
    Given the user has the following stocks in their portfolio:
      | Ticker | Shares | Purchase Price |
      | AAPL   | 10     | 150            |
      | TSLA   | 5      | 700            |
      | AMZN   | 2      | 3200           |
    And the current market prices are:
      | Ticker | Current Price |
      | AAPL   | 160           |
      | TSLA   | 680           |
      | AMZN   | 3300          |

  Scenario: View stock details in portfolio
    When the user navigates to the "My Portfolio" page
    Then the system should display the following details for each stock:
      | Ticker | Purchase Price | Current Price | Shares | Profit   |
      | AAPL   | $150           | $160          | 10     | $100     |
      | TSLA   | $700           | $680          | 5      | -$100    |
      | AMZN   | $3,200         | $3,300        | 2      | $200     |
    And the profit is calculated as (Current Price - Purchase Price) × Shares

  Scenario: View total profit in portfolio
    When the user views the portfolio summary
    Then the system should display the total profit as "$200"
    # Calculations:
    # AAPL profit: (160 - 150) × 10 = $100
    # TSLA profit: (680 - 700) × 5 = -$100
    # AMZN profit: (3300 - 3200) × 2 = $200
    # Total profit: $100 - $100 + $200 = $200

  Scenario: Stock with no current price available
    Given the current market price for "TSLA" is unavailable
    When the user views their portfolio
    Then the system should display "N/A" for the current price and profit of "TSLA"
    And display a message "Current price data is unavailable for some stocks."

  Scenario: Portfolio with no stocks
    Given the user has no stocks in their portfolio
    When the user navigates to the "My Portfolio" page
    Then the system should display a message "You have no stocks in your portfolio."
    And provide an option to "Add Stocks"

  Scenario: Update stock purchase price
    Given the user wants to update the purchase price of "AAPL"
    When the user edits the purchase price to "$155"
    Then the system should update the purchase price for "AAPL" to "$155"
    And recalculate the profit for "AAPL" as "$50"
    # Calculation: (160 - 155) × 10 = $50

  Scenario: Real-time update of current prices
    Given the user is viewing the "My Portfolio" page
    When the market price of "AAPL" changes to "$162"
    Then the system should update the current price of "AAPL" to "$162"
    And recalculate the profit for "AAPL" as "$120"
    # Calculation: (162 - 150) × 10 = $120

  Scenario: View profit in percentage
    When the user opts to view profit as a percentage
    Then the system should display the following details:
      | Ticker | Profit   | Profit (%) |
      | AAPL   | $100     | 6.67%      |
      | TSLA   | -$100    | -2.86%     |
      | AMZN   | $200     | 6.25%      |
    # Profit (%) Calculation: (Profit / (Purchase Price × Shares)) × 100%

  Scenario: Export portfolio details
    When the user selects "Export Portfolio"
    Then the system should provide a downloadable file containing all stock details
    And the file should include ticker symbol, purchase price, current price, number of shares, and profit

  Scenario: Display stocks sorted by profit
    When the user sorts the portfolio by "Profit"
    Then the stocks should be displayed in descending order of profit
