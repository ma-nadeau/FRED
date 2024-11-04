Feature: View Investment Performance
  As a user of Fred,
  I would like to view the performance I made or lost for each stock investment in my portfolio,
  So that I can see how much money I made.

  Background:
    Given the user has the following stock investments in their portfolio:
      | Symbol | Quantity | Purchase Price |
      | AAPL   | 10       | 150            |
      | TSLA   | 5        | 700            |
      | AMZN   | 2        | 3200           |
    And the current market prices are:
      | Symbol | Current Price |
      | AAPL   | 160           |
      | TSLA   | 680           |
      | AMZN   | 3300          |

  Scenario: View performance of each stock investment
    When the user navigates to the "Portfolio Performance" page
    Then the system should display the following performance details:
      | Symbol | Quantity | Purchase Price | Current Price | Gain/Loss | Gain/Loss (%) |
      | AAPL   | 10       | $150           | $160          | $100      | 6.67%         |
      | TSLA   | 5        | $700           | $680          | -$100     | -2.86%        |
      | AMZN   | 2        | $3,200         | $3,300        | $200      | 6.25%         |

  Scenario: View total portfolio performance
    When the user views their portfolio summary
    Then the system should display the total gain/loss as "$200"
    And the total gain/loss percentage as "2.86%"
    # Calculations:
    # Total Gain/Loss = $100 (AAPL) + (-$100) (TSLA) + $200 (AMZN) = $200
    # Total Investment = (10 * $150) + (5 * $700) + (2 * $3,200) = $1,500 + $3,500 + $6,400 = $11,400
    # Total Current Value = (10 * $160) + (5 * $680) + (2 * $3,300) = $1,600 + $3,400 + $6,600 = $11,600
    # Total Gain/Loss % = ($200 / $11,400) * 100% ≈ 1.75%

  Scenario: View performance details for a single stock
    When the user clicks on "AAPL" in their portfolio
    Then the system should display detailed performance information for "AAPL":
      And show a chart of historical price changes
      And display the following metrics:
        | Metric            | Value        |
        | Quantity          | 10           |
        | Purchase Price    | $150         |
        | Current Price     | $160         |
        | Total Investment  | $1,500       |
        | Current Value     | $1,600       |
        | Gain/Loss         | $100         |
        | Gain/Loss (%)     | 6.67%        |

  Scenario: Performance updates with market changes
    Given the market price of "TSLA" changes to "$710"
    When the user refreshes the "Portfolio Performance" page
    Then the system should update the performance details for "TSLA":
      | Symbol | Current Price | Gain/Loss | Gain/Loss (%) |
      | TSLA   | $710          | $50       | 1.43%         |
    And the total portfolio gain/loss should be updated accordingly

  Scenario: Handle unavailable current price data
    Given the current market price for "AMZN" is unavailable
    When the user views the "Portfolio Performance" page
    Then the system should display "Data Unavailable" for "AMZN" current price and gain/loss
    And exclude "AMZN" from the total portfolio performance calculations
    And display a message "Some data is currently unavailable and is excluded from total calculations."

  Scenario: View performance after selling some shares
    Given the user has sold "5" shares of "AAPL" at "$165" per share
    And the transaction is recorded in the system
    When the user views the "Portfolio Performance" page
    Then the system should adjust the quantity of "AAPL" to "5"
    And calculate the new average purchase price if applicable
    And display the updated performance for "AAPL"

  Scenario: View historical performance over time
    When the user selects the option to view "Historical Performance"
    Then the system should display a graph showing portfolio value over time
    And allow the user to select different time ranges (e.g., 1 month, 6 months, 1 year)

  Scenario: No investments in portfolio
    Given the user has no stock investments in their portfolio
    When the user navigates to the "Portfolio Performance" page
    Then the system should display a message "You have no stock investments to display."
    And provide a link to "Add Investments"

  Scenario: Display dividends earned
    Given the user owns stocks that have paid dividends
    And the user has received "$50" in dividends from "AAPL"
    When the user views the performance details for "AAPL"
    Then the system should display "Dividends Earned: $50"
    And include dividends in the total gain/loss calculation if selected


