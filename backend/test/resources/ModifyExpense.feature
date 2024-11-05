Feature: Modify an Expense
As a user of Fred, I would like to modify an expense that has been made in my expenses collection, so that I don't need to manually delete and create a new one"

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

  Scenario: User successfully modifies an existing expense's description
    When the user attempts to modify the description of an existing expense with the type WITHDRAWAL, linked with user "<userId>", in account "<accountId>", with id <"id">, amount "<amount>" and description "<description>" to description <"description">
    Then the expense with the type WITHDRAWAL, in account "<accountId>", amount "<amount>" shall have the description  "<description>"

    Examples:
      | userId | id | amount | description   |
      |      1 |  1 |   30.0 | gift          |
      |      1 |  2 |   50.0 | movie tickets |
      |      1 |  3 |  150.0 | dinner        |

  Scenario: User successfully modifies an existing expense's amount
    When the user attempts to modify the description of an existing expense with the type WITHDRAWAL, linked with user "<userId>", with id <"id">, amount "<amount>" and description "<description>" to description <"description">
    Then the expense with the type WITHDRAWAL, linked with user "<userId>", with id <"id">,  amount "<amount>" shall have the amount  "<amount>"

    Examples:
      | userId | id | amount | description   |
      |      1 |  1 |  200.0 | groceries     |
      |      1 |  2 |   50.0 | movie tickets |
      |      1 |  3 |  150.0 | dinner        |

  Scenario: User unsuccessfully changes the description of an expense due to transaction being non existent
    When the user attempts to modify the description of an existing expense with the type WITHDRAWAL, linked with user "<userId>",  with id <"id">, amount "<amount>" and description "<description>" to description <"description">
    Then the expense with the type WITHDRAWAL, linked with user "<userId>", with id <"id">, amount "<amount>" shall not exist in the system
    Then the error "<error>" shall be raised

    Examples:
      | userId | id  | amount | description   | error                |
      |      1 | 999 |   30.0 | groceries     | expense not existent |
      |      1 |   2 |   50.0 | movie tickets |                      |
      |      1 |   3 |  150.0 | dinner        |                      |

  Scenario: User unsuccessfully changes the description of an existing expense due to transaction not being linked to their account
    When the user attempts to modify the description of an existing expense with the type WITHDRAWAL, linked with user "<userId>",   with ID <"id">, amount "<amount>" and description "<description>" to description <"description">
    Then the expense with the type WITHDRAWAL, linked with user "<userId>",  with ID <"id">, amount "<amount>" shall not exist in the system
    Then the error "<error>" shall be raised

    Examples:
      | userId | id  | amount | description   | error                |
      |      1 | 999 |   30.0 | groceries     | expense not existent |
      |      1 |   2 |   50.0 | movie tickets |                      |
      |      1 |   3 |  150.0 | dinner        |                      |

  Scenario: User unsuccessfully changes the description of an existing expense due to missing description and amount
    When the user attempts to create a new expense with the type WITHDRAWAL, linked with user "<userId>", amount "<amount>" and description "<description>"
    Then a new expense with the type WITHDRAWAL,linked with user "<userId>", amount "<amount>" and description "<description>" shall not exist in the system
    Then the error "<error>" shall be raised

    Examples:
      | userId | id | amount | description      | error                         |
      |      1 |  1 |   30.0 | groceries        |                               |
      |      1 |  2 |   50.0 | movie tickets    |                               |
      |      1 |  4 |  150.0 | kitchen supplies | expense is not linked to user |
