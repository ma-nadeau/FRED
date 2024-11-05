Feature: Delete an Expense
As a user of Fred, I would like to delete an expense from my expenses collection, so that I can keep my expenses up to date if I made a mistake or get a refund on that expense

  Background:
    Given the following user account exist in the system
      | id | name     | email            | age |
      |  1 | John Doe | jdoe@test.com    |  67 |
      |  2 | Jane Doe | janedoe@test.com |  33 |
    Given the following main account exists in the system
      | id | userId | type | institution                |
      |  1 |      1 | BANK | Banque Nationale du Canada |
      |  2 |      2 | BANK | Banque de France           |
    Given the following users is logged in
      | id | name     | email            |
      |  1 | John Doe | jdoe@test.com    |
      |  2 | Jane Doe | janedoe@test.com |
    Given the following bank account exists in the system for this user
      | id | type         | name     | balance | interestRate | mainAccountId |
      |  1 | SAVINGS_TFSA | car      |   150.0 |         0.02 |             1 |
      |  2 | CHECKING     | school   |   200.0 |         0.01 |             1 |
      |  3 | CHECKING     | personal |   250.0 |         0.01 |             2 |
    And the following transactions are linked with this bank account
      | id | accountId | amount | transactionAt       | type       | description      | recurringCashFlows |
      |  1 |         2 |   30.0 | 2020-01-03 00:00:10 | WITHDRAWAL | groceries        | null               |
      |  2 |         2 |   50.0 | 2020-01-03 00:00:10 | WITHDRAWAL | movie tickets    | null               |
      |  3 |         2 |  150.0 | 2020-01-10 12:00:20 | WITHDRAWAL | dinner           | null               |
      |  4 |         3 |  150.0 | 2020-01-10 12:00:20 | WITHDRAWAL | kitchen supplies | null               |

  Scenario: Successfully delete an existing expense
    When the user attempts to delete an expense with the type WITHDRAWAL, id "<id">, linked with user "<userId>", amount "<amount>" and description "<description>"
      | userId | id | amount | description |
      |      1 |  1 |   30.0 | groceries   |
    Then the expense with type WITHDRAWAL, with ID <"id">,  linked with user "<userId>", amount "<amount>" and description "<description>" shall not exist in the system
    Then the number of accounts linked to that user in the system shall be "2"

    Examples:
      | userId | id | amount | description   |
      |      1 |  2 |   50.0 | movie tickets |
      |      1 |  3 |  150.0 | dinner        |

  Scenario: Unsuccessfully deletes an expense due to non existent expense
    When the user "<userId>" attempts to delete an expense with the type WITHDRAWAL, ID "<id">, linked with user "<userId>", with amount "<amount>" and description "<description>"
    And the expense with type WITHDRAWAL, with ID <"id">,  linked with user "<userId>", amount "<amount>" and description "<description>" does not exist in the system
    Then the number of accounts linked to that user in the system shall remain "2"
    Then the error "<error>" shall be raised

    Examples:
      | userId | id | amount | description   | error                  |
      |      1 |  1 |   30.0 | groceries     |                        |
      |      1 |  2 |   50.0 | movie tickets |                        |
      |      1 | 99 |  150.0 | dinner        | expense does not exist |

  Scenario: Unsuccessfully deletes an expense due to expense not linked to user
    When the user "<userId>" attempts to delete an expense with the type WITHDRAWAL, ID "<id">,  linked with user "<userId>", with amount "<amount>" and description "<description>"
    And the expense with type WITHDRAWAL, with ID <"id">,  linked with user "<userId>", amount "<amount>" and description "<description>" does not exist in the system
    Then the number of accounts linked to that user in the system shall remain "2"
    Then the error "<error>" shall be raised

    Examples:
      | userId | id | amount | description      | error                         |
      |      1 |  1 |   30.0 | groceries        |                               |
      |      1 |  2 |   50.0 | movie tickets    |                               |
      |      1 |  4 |  150.0 | kitchen supplies | expense is not linked to user |
