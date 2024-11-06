Feature: Generate AI Suggestions
  As a user of Fred,
  I would like to generate AI suggestions upon request,
  So that I can get personalized advice on how to better spend my money based on my current income and expenses.

  Background:
    Given the user has the following income:
      | source         | amount |
      | Salary         | 5000   |
      | Freelance Work | 1000   |
    And the user has the following expenses:
      | description    | category      | date       | amount |
      | Rent           | Housing       | 2024-10-01 | 1500   |
      | Groceries      | Food          | 2024-10-05 | 400    |
      | Utilities      | Bills         | 2024-10-07 | 200    |
      | Entertainment  | Leisure       | 2024-10-10 | 300    |
      | Savings        | Savings       | 2024-10-15 | 500    |
      | Transportation | Transport     | 2024-10-18 | 150    |
      | Dining Out     | Food          | 2024-10-20 | 250    |
      | Gym Membership | Health        | 2024-10-22 | 100    |

  Scenario: Generate AI suggestion successfully
    Given the user is on the dashboard page
    When the user requests an AI spending suggestion
    Then the system should generate personalized advice based on the user's income and expenses
    And the advice should be displayed to the user

  Scenario: Generate AI suggestion with high discretionary spending
    Given the user is on the dashboard page
    And the user's discretionary expenses exceed 30% of income
    When the user requests an AI spending suggestion
    Then the system should advise the user to reduce discretionary spending
    And suggest specific categories to cut back on, such as "Entertainment" and "Dining Out"

  Scenario: Generate AI suggestion when savings are low
    Given the user is on the dashboard page
    And the user's savings are less than 10% of income
    When the user requests an AI spending suggestion
    Then the system should advise the user to increase savings
    And suggest reallocating funds from other expenses to savings

  Scenario: No income data available
    Given the user has not entered any income data
    When the user requests an AI spending suggestion
    Then the system should prompt the user to enter income information
    And no advice should be generated

  Scenario: No expenses recorded
    Given the user has not recorded any expenses
    When the user requests an AI spending suggestion
    Then the system should inform the user that there is insufficient data to generate advice
    And prompt the user to record expenses

  Scenario: User cancels AI suggestion request
    Given the user is on the dashboard page
    When the user initiates an AI spending suggestion request
    And then cancels the request
    Then the system should not generate any advice
    And return the user to the dashboard page

  Scenario: System error during AI suggestion generation
    Given the user is on the dashboard page
    When the user requests an AI spending suggestion
    And an error occurs in the system
    Then the system should display an error message
    And advise the user to try again later

  Scenario: AI suggestion considers recent changes in income
    Given the user has updated their income recently
    When the user requests an AI spending suggestion
    Then the system should generate advice based on the most recent income data

  Scenario: AI suggestion respects user privacy settings
    Given the user has set privacy settings to limit data sharing
    When the user requests an AI spending suggestion
    Then the system should generate advice without violating privacy settings
    And inform the user if certain data is unavailable due to privacy restrictions

  Scenario: AI suggestion with multiple income sources
    Given the user has multiple income sources
    When the user requests an AI spending suggestion
    Then the system should consider all income sources in the advice
    And provide a comprehensive spending plan

  Scenario: AI suggestion provides actionable steps
    Given the user is on the dashboard page
    When the user requests an AI spending suggestion
    Then the system should provide actionable steps
    And include specific recommendations, such as "Reduce dining out expenses by 20%"

