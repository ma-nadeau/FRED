Feature: Filter Expenses
  As a user of Fred,
  I want to filter my expenses by date, price, name, and category
  So that I can easily view specific expenses according to my needs.

  Background:
    Given the following expenses exist in the system:
      | description       | category      | date       | amount |
      | Groceries         | Food          | 2024-10-01 | 150    |
      | Gas               | Transport     | 2024-10-05 | 60     |
      | Coffee            | Food          | 2024-10-06 | 10     |
      | Concert Ticket    | Entertainment | 2024-10-07 | 100    |
      | Rent              | Housing       | 2024-10-01 | 1200   |
      | Gym Membership    | Health        | 2024-10-10 | 50     |
      | Uber Ride         | Transport     | 2024-10-08 | 25     |
      | Dinner            | Food          | 2024-10-09 | 75     |

  Scenario: Display all expenses by default
    Given the user is on the expenses page
    Then all expenses should be displayed
    And the total number of expenses displayed should be "8"

  Scenario: Filter expenses by category
    Given the user is on the expenses page
    When the user filters expenses by category "Food"
    Then only expenses with category "Food" should be displayed
    And the expenses list should contain "Groceries", "Coffee", "Dinner"
    And the total number of expenses displayed should be "3"

  Scenario: Filter expenses by date
    Given the user is on the expenses page
    When the user filters expenses by date "2024-10-01"
    Then only expenses on date "2024-10-01" should be displayed
    And the expenses list should contain "Groceries", "Rent"
    And the total number of expenses displayed should be "2"

  Scenario: Filter expenses by amount range
    Given the user is on the expenses page
    When the user filters expenses with an amount between "0" and "50"
    Then only expenses with amount between "0" and "50" should be displayed
    And the expenses list should contain "Coffee", "Gym Membership", "Uber Ride"
    And the total number of expenses displayed should be "3"

  Scenario: Filter expenses by description keyword
    Given the user is on the expenses page
    When the user filters expenses by description containing "Ticket"
    Then only expenses with descriptions containing "Ticket" should be displayed
    And the expenses list should contain "Concert Ticket"
    And the total number of expenses displayed should be "1"

  Scenario: Combine multiple filters
    Given the user is on the expenses page
    When the user filters expenses by category "Food"
    And the user filters expenses with an amount between "50" and "200"
    Then only expenses matching all filters should be displayed
    And the expenses list should contain "Groceries", "Dinner"
    And the total number of expenses displayed should be "2"

  Scenario: No matching expenses for filters
    Given the user is on the expenses page
    When the user filters expenses by category "Education"
    Then no expenses should be displayed
    And the total number of expenses displayed should be "0"

  Scenario: Reset filters to view all expenses
    Given the user has applied some filters
    When the user resets all filters
    Then all expenses should be displayed
    And the total number of expenses displayed should be "8"
