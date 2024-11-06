Feature: Filter Expenses
  As a user of Fred,
  I want to filter my expenses by date, price, name, and category,
  So that I can easily view specific expenses according to my needs.

  Background:
    Given the following expenses exist in the system:
      | Description        | Category      | Date       | Amount |
      | Groceries          | Food          | 2024-10-01 | 150    |
      | Gas                | Transport     | 2024-10-05 | 60     |
      | Coffee             | Food          | 2024-10-06 | 10     |
      | Concert Ticket     | Entertainment | 2024-10-07 | 100    |
      | Rent               | Housing       | 2024-10-01 | 1200   |
      | Gym Membership     | Health        | 2024-10-10 | 50     |
      | Uber Ride          | Transport     | 2024-10-08 | 25     |
      | Dinner             | Food          | 2024-10-09 | 75     |

  Scenario Outline: Filter expenses by category
    Given I have a list of expenses
    When I filter expenses by category "<Category>"
    Then I should see the following expenses:
      | Description | Category | Date       | Amount |
      | <Expense List>                                      |
    And the total number of expenses displayed should be "<Total Count>"

    Examples:
      | Category      | Expense List                                                                                                                                                           | Total Count |
      | Food          | Groceries     | Food | 2024-10-01 | 150\nCoffee       | Food | 2024-10-06 | 10\nDinner       | Food | 2024-10-09 | 75                                                   | 3           |
      | Transport     | Gas           | Transport | 2024-10-05 | 60\nUber Ride    | Transport | 2024-10-08 | 25                                                                                   | 2           |
      | Entertainment | Concert Ticket | Entertainment | 2024-10-07 | 100                                                                                                                   | 1           |
      | Housing       | Rent          | Housing | 2024-10-01 | 1200                                                                                                                         | 1           |

  Scenario Outline: Filter expenses by date
    Given I have a list of expenses
    When I filter expenses by date "<Date>"
    Then I should see the following expenses:
      | Description    | Category | Date       | Amount |
      | <Expense List>                                      |
    And the total number of expenses displayed should be "<Total Count>"

    Examples:
      | Date        | Expense List                                                                                                                  | Total Count |
      | 2024-10-01  | Groceries | Food    | 2024-10-01 | 150\nRent      | Housing | 2024-10-01 | 1200                                              | 2           |
      | 2024-10-05  | Gas       | Transport | 2024-10-05 | 60                                                                                      | 1           |
      | 2024-10-07  | Concert Ticket | Entertainment | 2024-10-07 | 100                                                                             | 1           |
      | 2024-10-10  | Gym Membership | Health | 2024-10-10 | 50                                                                                     | 1           |

  Scenario Outline: Filter expenses by amount range
    Given I have a list of expenses
    When I filter expenses with an amount between "<Min Amount>" and "<Max Amount>"
    Then I should see the following expenses:
      | Description       | Category      | Date       | Amount |
      | <Expense List>                                      |
    And the total number of expenses displayed should be "<Total Count>"

    Examples:
      | Min Amount | Max Amount | Expense List                                                                                                                                                                                                                                                                       | Total Count |
      | 50         | 200        | Groceries       | Food          | 2024-10-01 | 150\nGas             | Transport     | 2024-10-05 | 60\nConcert Ticket   | Entertainment | 2024-10-07 | 100\nDinner          | Food          | 2024-10-09 | 75\nGym Membership   | Health        | 2024-10-10 | 50 | 5           |
      | 0          | 25         | Coffee          | Food          | 2024-10-06 | 10\nUber Ride        | Transport     | 2024-10-08 | 25                                                                                                                 | 2           |
      | 100        | 1200       | Groceries       | Food          | 2024-10-01 | 150\nConcert Ticket   | Entertainment | 2024-10-07 | 100\nRent             | Housing       | 2024-10-01 | 1200                                                                                                                | 3           |

  Scenario Outline: Filter expenses by description keyword
    Given I have a list of expenses
    When I filter expenses by description containing "<Keyword>"
    Then I should see the following expenses:
      | Description    | Category      | Date       | Amount |
      | <Expense List>                                      |
    And the total number of expenses displayed should be "<Total Count>"

    Examples:
      | Keyword    | Expense List                                                                                     | Total Count |
      | Ticket     | Concert Ticket | Entertainment | 2024-10-07 | 100                                                | 1           |
      | Membership | Gym Membership | Health        | 2024-10-10 | 50                                                 | 1           |
      | Ride       | Uber Ride      | Transport     | 2024-10-08 | 25                                                 | 1           |

  Scenario: Combine filters for category and amount range
    Given I have a list of expenses
    When I filter expenses by category "Food"
    And I filter expenses with an amount between "50" and "200"
    Then I should see the following expenses:
      | Description | Category | Date       | Amount |
      | Groceries   | Food     | 2024-10-01 | 150    |
      | Dinner      | Food     | 2024-10-09 | 75     |
    And the total number of expenses displayed should be "2"

  Scenario: No matching expenses for filters
    Given I have a list of expenses
    When I filter expenses by category "Education"
    Then I should see no expenses
    And the total number of expenses displayed should be "0"

  Scenario: Reset filters to view all expenses
    Given I have applied filters to my expense list
    When I reset all filters
    Then I should see all expenses:
      | Description        | Category      | Date       | Amount |
      | Groceries          | Food          | 2024-10-01 | 150    |
      | Gas                | Transport     | 2024-10-05 | 60     |
      | Coffee             | Food          | 2024-10-06 | 10     |
      | Concert Ticket     | Entertainment | 2024-10-07 | 100    |
      | Rent               | Housing       | 2024-10-01 | 1200   |
      | Gym Membership     | Health        | 2024-10-10 | 50     |
      | Uber Ride          | Transport     | 2024-10-08 | 25     |
      | Dinner             | Food          | 2024-10-09 | 75     |
    And the total number of expenses displayed should be "8"
