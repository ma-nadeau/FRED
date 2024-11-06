Feature: View Stock Information
  As a user of Fred,
  I would like to view the ticker symbol, the price I bought for, the current price, and number of shares for each stock in my portfolio,
  So that I can have an overview of my stock investments.

  Background:
    Given I have the following stocks in my portfolio:
      | Ticker | Shares | Purchase Price |
      | AAPL   | 10     | 150            |
      | TSLA   | 5      | 700            |
      | AMZN   | 2      | 3200           |
    And the current market prices are:
      | Ticker | Current Price |
      | AAPL   | 160           |
      | TSLA   | 680           |
      | AMZN   | 3300          |

  Scenario: View stock information in portfolio
    When I view my stock portfolio
    Then I should see the following stock information:
      | Ticker | Shares | Purchase Price | Current Price |
      | AAPL   | 10     | $150           | $160          |
      | TSLA   | 5      | $700           | $680          |
      | AMZN   | 2      | $3,200         | $3,300        |

  Scenario: Stock with no current price available
    Given the current market price for "TSLA" is unavailable
    When I view my stock portfolio
    Then I should see the following stock information:
      | Ticker | Shares | Purchase Price | Current Price |
      | AAPL   | 10     | $150           | $160          |
      | TSLA   | 5      | $700           | N/A           |
      | AMZN   | 2      | $3,200         | $3,300        |
    And I should be informed that current price data is unavailable for some stocks

  Scenario: Portfolio with no stocks
    Given I have no stocks in my portfolio
    When I view my stock portfolio
    Then I should see a message "You have no stocks in your portfolio."

  Scenario: Add a new stock to the portfolio
    Given I have the following stock in my portfolio:
      | Ticker | Shares | Purchase Price |
      | AAPL   | 10     | 150            |
    When I add a new stock with the following information:
      | Ticker | Shares | Purchase Price |
      | GOOGL  | 3      | 2000           |
    Then my portfolio should include:
      | Ticker | Shares | Purchase Price | Current Price |
      | AAPL   | 10     | $150           | $160          |
      | GOOGL  | 3      | $2,000         | [Current Price of GOOGL] |

  Scenario: View stock information after selling shares
    Given I have the following stock in my portfolio:
      | Ticker | Shares | Purchase Price |
      | AAPL   | 10     | 150            |
    And I have sold "5" shares of "AAPL"
    When I view my stock portfolio
    Then I should see the following stock information:
      | Ticker | Shares | Purchase Price | Current Price |
      | AAPL   | 5      | $150           | $160          |

  Scenario: Handle fractional shares
    Given I have the following stock in my portfolio:
      | Ticker | Shares | Purchase Price |
      | NFLX   | 0.75   | 500            |
    And the current market price for "NFLX" is "$550"
    When I view my stock portfolio
    Then I should see the following stock information:
      | Ticker | Shares | Purchase Price | Current Price |
      | NFLX   | 0.75   | $500           | $550          |

  Scenario: Real-time update of current prices
    Given I am viewing my stock portfolio
    And the current market prices are:
      | Ticker | Current Price |
      | AAPL   | 160           |
      | TSLA   | 680           |
    When the market price of "AAPL" changes to "$162"
    Then I should see the current price for "AAPL" updated to "$162" in my portfolio

  Scenario: Display stocks sorted alphabetically
    Given I have the following stocks in my portfolio:
      | Ticker | Shares | Purchase Price |
      | TSLA   | 5      | 700            |
      | AAPL   | 10     | 150            |
      | AMZN   | 2      | 3200           |
    When I view my stock portfolio sorted alphabetically
    Then I should see the stocks in the following order:
      | Ticker | Shares | Purchase Price | Current Price |
      | AAPL   | 10     | $150           | $160          |
      | AMZN   | 2      | $3,200         | $3,300        |
      | TSLA   | 5      | $700           | $680          |

  Scenario: View detailed stock information
    Given I have the following stock in my portfolio:
      | Ticker | Shares | Purchase Price |
      | AAPL   | 10     | 150            |
    When I request detailed information for "AAPL"
    Then I should see the following additional information:
      | Field                   | Value                     |
      | Company Name            | Apple Inc.                |
      | Market Capitalization   | [Market Cap of AAPL]      |
      | 52-Week High            | [52-Week High of AAPL]    |
      | 52-Week Low             | [52-Week Low of AAPL]     |
      | Dividend Yield          | [Dividend Yield of AAPL]  |

  Scenario: Stock with high-precision purchase price
    Given I have the following stock in my portfolio:
      | Ticker | Shares | Purchase Price |
      | ABCD   | 1000   | 0.12345        |
    And the current market price for "ABCD" is "$0.13000"
    When I view my stock portfolio
    Then I should see the following stock information:
      | Ticker | Shares | Purchase Price | Current Price |
      | ABCD   | 1000   | $0.12345       | $0.13000      |

  Scenario: Display stock information in different currencies
    Given I prefer to view amounts in "EUR"
    And the exchange rate is 1 USD = 0.85 EUR
    When I view my stock portfolio
    Then I should see the stock information with amounts converted to EUR:
      | Ticker | Shares | Purchase Price (EUR) | Current Price (EUR) |
      | AAPL   | 10     | €127.50              | €136.00             |
      | TSLA   | 5      | €595.00              | €578.00             |
    # Calculations:
    # AAPL Purchase Price in EUR: $150 × 0.85 = €127.50
    # AAPL Current Price in EUR: $160 × 0.85 = €136.00
    # TSLA Purchase Price in EUR: $700 × 0.85 = €595.00
    # TSLA Current Price in EUR: $680 × 0.85 = €578.00

  Scenario: No current price available for any stock
    Given I have the following stocks in my portfolio:
      | Ticker | Shares | Purchase Price |
      | AAPL   | 10     | 150            |
      | TSLA   | 5      | 700            |
    And current market prices are unavailable
    When I view my stock portfolio
    Then I should see the current price as "N/A" for all stocks
    And I should be informed that current price data is unavailable
