Feature: Generate AI Expense Advice
  As a user of Fred,
  I would like to generate AI advice on my expenses,
  So that I can get personalized suggestions on how to better spend my money based on my current income and expenses.

  Background:
    Given I have the following income sources:
      | Source         | Amount |
      | Salary         | 5000   |
      | Freelance Work | 1000   |
    And I have the following expenses recorded:
      | Description    | Category      | Date       | Amount |
      | Rent           | Housing       | 2024-10-01 | 1500   |
      | Groceries      | Food          | 2024-10-05 | 400    |
      | Utilities      | Bills         | 2024-10-07 | 200    |
      | Entertainment  | Leisure       | 2024-10-10 | 300    |
      | Savings        | Savings       | 2024-10-15 | 500    |
      | Transportation | Transport     | 2024-10-18 | 150    |
      | Dining Out     | Food          | 2024-10-20 | 250    |
      | Gym Membership | Health        | 2024-10-22 | 100    |

  Scenario: Generate AI advice successfully
    Given I have income and expense data
    When I request AI expense advice
    Then I should receive personalized suggestions based on my income and expenses
    And the advice should include specific recommendations

  Scenario: Advice on reducing discretionary spending
    Given I have income and expense data
    And my discretionary expenses exceed 30% of my income
    When I request AI expense advice
    Then I should receive advice to reduce discretionary spending
    And the advice should suggest categories to cut back on:
      | Suggested Categories |
      | Entertainment        |
      | Dining Out           |
      | Leisure              |

  Scenario: Advice on increasing savings
    Given I have income and expense data
    And my savings are less than 10% of my income
    When I request AI expense advice
    Then I should receive advice to increase my savings
    And the advice should suggest reallocating funds from other expenses to savings

  Scenario: No income data available
    Given I have no income data recorded
    When I request AI expense advice
    Then I should be informed that income data is required
    And I should receive instructions on how to add income data

  Scenario: No expense data available
    Given I have no expense data recorded
    When I request AI expense advice
    Then I should be informed that expense data is required
    And I should receive instructions on how to add expense data

  Scenario: Insufficient data for advice
    Given I have income data:
      | Source | Amount |
      | Salary | 5000   |
    And I have expense data:
      | Description | Category | Date       | Amount |
      | Rent        | Housing  | 2024-10-01 | 1500   |
    When I request AI expense advice
    Then I should receive advice indicating that more data is needed for comprehensive suggestions

  Scenario: Advice includes actionable steps
    Given I have income and expense data
    When I request AI expense advice
    Then I should receive advice that includes actionable steps
    And the steps should be specific and measurable:
      | Recommendation                                    |
      | Reduce dining out expenses by $100 per month      |
      | Increase monthly savings by $200                  |
      | Limit entertainment expenses to $150 per month    |

  Scenario: Advice respects user privacy settings
    Given I have income and expense data
    And I have privacy settings that limit data sharing
    When I request AI expense advice
    Then the advice should be generated without violating my privacy settings
    And I should be informed if certain data was excluded due to privacy settings

  Scenario: Advice after recent income change
    Given I have updated my income data recently
    And my new income is:
      | Source | Amount |
      | Salary | 6000   |
    When I request AI expense advice
    Then the advice should be based on the most recent income data
    And the suggestions should reflect the income change

  Scenario: Advice includes budget allocation
    Given I have income and expense data
    When I request AI expense advice
    Then I should receive advice that includes a recommended budget allocation:
      | Category        | Recommended Allocation (%) |
      | Housing         | 25                         |
      | Food            | 15                         |
      | Savings         | 20                         |
      | Transportation  | 10                         |
      | Entertainment   | 10                         |
      | Others          | 20                         |

  Scenario: Advice considers financial goals
    Given I have income and expense data
    And I have set a financial goal to save $10,000 in a year
    When I request AI expense advice
    Then the advice should include steps to help achieve my financial goal
    And suggest adjustments in spending to meet the goal

  Scenario: Advice for reducing debt
    Given I have income and expense data
    And I have recorded debts:
      | Debt Type    | Amount | Interest Rate (%) |
      | Credit Card  | 5000   | 18                |
      | Student Loan | 15000  | 5                 |
    When I request AI expense advice
    Then I should receive advice on how to reduce my debt
    And the advice should prioritize high-interest debts

  Scenario: Error handling when AI service is unavailable
    Given I have income and expense data
    And the AI service is currently unavailable
    When I request AI expense advice
    Then I should receive an error message indicating the service is unavailable
    And I should be advised to try again later
