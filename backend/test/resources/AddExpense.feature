Feature: Add New Expense
As a user of Fred, I would like to manually add an expense to my expense collection including the amount and optional description.

  Background:
    Given the following user account exist in the system
      | id | name     | email         | age |
      |  1 | John Doe | jdoe@test.com |  67 |
    Given the following main account exists in the system
      | id | userId | type | accountId | institution                |
      |  1 |      1 | BANK |         1 | Banque Nationale du Canada |
    Given the following user is logged in
      | id | name     | email         |
      |  1 | John Doe | jdoe@test.com |
    Given the following bank account exists in the system for this user
      | id | type         | name   | balance | interestRate |
      |  1 | SAVINGS_TFSA | car    |   150.0 |         0.02 |
      |  2 | CHECKING     | school |   200.0 |         0.01 |
    Given the following transactions are linked with this bank account
      | id | accountId | amount | transactionAt       | type       | description   | recurringCashFlows |
      |  2 |         2 |   50.0 | 2020-01-03 00:00:10 | WITHDRAWAL | movie tickets | null               |
    Given the following recurringCashFlows are linked with this bank account
      | id | accountId | name         | amount | isActive | frequency |
      |  1 |         1 | subscription |  200.0 | true     | WEEKLY    |

  Scenario: Successfully add a new expense
    When the user attempts to create a new expense with the type WITHDRAWAL,linked with "<userId">, in account "<accountId>",  amount "<amount>" and description "<description>"
    Then a new expense with the type WITHDRAWAL,linked with "<userId">, in account "<accountId>", amount "<amount>" and description "<description>" shall exist in the system
    Then the number of expenses linked to that user in the system shall be "2"

    Examples:
      | userId | accountId | amount | description |
      |      1 |         2 |   20.0 | groceries   |

  Scenario: Unsuccessfully add a new expense due to missing account id
    When the user attempts to create a new expense with the type WITHDRAWAL,  linked with "<userId">, in account "<accountId>",  amount "<amount>" and description "<description>"
    Then a new expense with the type WITHDRAWAL,linked with "<userId">, in account "<accountId>", amount "<amount>" and description "<description>" shall not exist in the system
    Then the number of expenses linked to that user in the system shall be "1"
    Then the error "<error>" shall be raised

    Examples:
      | userId | accountId | amount | description | error              |
      |      1 |           |   20.0 | groceries   | missing account id |

  Scenario: Unsuccessfully add a new expense due to invalid account id
    When the user attempts to create a new expense with the type WITHDRAWAL,  linked with "<userId">, in account "<accountId>", amount "<amount>" and description "<description>"
    Then a new expense with the type WITHDRAWAL,linked with "<userId">, in account "<accountId>", amount "<amount>" and description "<description>" shall not exist in the system
    Then the number of expenses linked to that user in the system shall be "1"
    Then the error "<error>" shall be raised

    Examples:
      | userId | accountId | amount | description | error              |
      |      1 | -08383476 |   20.0 | groceries   | invalid account id |

  Scenario: Unsuccessfully add a new expense due to missing amount
    When the user attempts to create a new expense with the type WITHDRAWAL,linked with "<userId">, in account "<accountId>", amount "<amount>" and description "<description>"
    Then a new expense with the type WITHDRAWAL,linked with "<userId">,  in account "<accountId>", amount "<amount>" and description "<description>" shall not exist in the system
    Then the number of expenses linked to that user in the system shall be "1"
    Then the error "<error>" shall be raised

    Examples:
      | userId | accountId | amount | description | error          |
      |      1 |         2 |        | groceries   | missing amount |
