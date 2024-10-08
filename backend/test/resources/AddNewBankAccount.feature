Feature: Add New Bank Account
As a user, I would like to add a new account from my bank to my profile, so that I can use Fred's features for all my accounts

  Background:
    Given the following user account exist in the system
      | id | name     | email         | age |
      |  1 | John Doe | jdoe@test.com |  67 |
    And the following main account exists in the system
      | id | userId | type | accountId | institution                |
      |  1 |      1 | BANK |         1 | Banque Nationale du Canada |
    And the following user is logged in
      | id | name     | email         |
      |  1 | John Doe | jdoe@test.com |
    And the following bank account exists in the system for this user
      | id | type         | name   | balance | interestRate |
      |  1 | SAVINGS_TFSA | car    |   150.0 |         0.02 |
      |  2 | CHECKING     | school |   200.0 |         0.01 |
    Given the following transactions are linked with this bank account
      | id | accountId | amount | transactionAt       | type       | description   | recurringCashFlows |
      |  1 |         1 |  200.0 | 2020-01-02 00:00:05 | DEPOSIT    | salary        |                  1 |
      |  2 |         2 |   50.0 | 2020-01-03 00:00:10 | WITHDRAWAL | movie tickets | null               |
      |  3 |         2 |  100.0 | 2020-01-04 00:00:15 | DEPOSIT    | salary        |                  2 |
    Given the following recurringCashFlows are linked with this bank account
      | id | accountId | name   | amount | isActive | frequency |
      |  1 |         1 | salary |  200.0 | true     | WEEKLY    |
      |  2 |         2 | salary |  100.0 | false    | BIWEEKLY  |

  Scenario: Successfully create a new bank account
    When the user attempts to create a new bank account with the  type "<type>", name "<name>", balance "<balance>" and interestRate "<interestRate>"
    Then a new bank account with account type "<type>", name "<name>", balance "<balance>" and interestRate "<interestRate>" shall exist in the system
    Then the number of accounts linked to that user in the system shall be "3"

    Examples:
      | type         | name    | balance | interestRate |
      | CHECKING     | g-wagon |   100.0 |         0.01 |
      | SAVINGS_TFSA | house   |   150.0 |         0.03 |

  Scenario: Unsuccessfully create a new bank account due to missing account name
    When the user attempts to create a new bank account with the  type "<type>", name "<name>", balance "<balance>" and interestRate "<interestRate>"
    Then a new bank account with account type "<type>", name "<name>", balance "<balance>" and interestRate "<interestRate>" shall exist in the system
    Then the number of accounts linked to that user in the system shall be "2"
    Then the error "<error>" shall be raised

    Examples:
      | type         | name | balance | interestRate | error                |
      | CHECKING     |      |   100.0 |         0.01 | missing account name |
      | SAVINGS_TFSA |      |   150.0 |         0.03 | missing account name |

  Scenario: Unsuccessfully create a new bank account due to missing initial balance
    When the user attempts to create a new bank account with the  type "<type>", name "<name>", balance "<balance>" and interestRate "<interestRate>"
    Then a new bank account with account type "<type>", name "<name>", balance "<balance>" and interestRate "<interestRate>" shall exist in the system
    Then the number of accounts linked to that user in the system shall be "2"
    Then the error "<error>" shall be raised

    Examples:
      | type         | name    | balance | interestRate | error                   |
      | CHECKING     | g-wagon |         |         0.01 | missing initial balance |
      | SAVINGS_TFSA | house   |         |         0.03 | missing initial balance |

  Scenario: Unsuccessfully create a new bank account due to invalid account type
    When the user attempts to create a new bank account with the  type "<type>", name "<name>", balance "<balance>" and interestRate "<interestRate>"
    Then a new bank account with account type "<type>", name "<name>", balance "<balance>" and interestRate "<interestRate>" shall exist in the system
    Then the number of accounts linked to that user in the system shall be "2"
    Then the error "<error>" shall be raised

    Examples:
      | type    | name    | balance | interestRate | error                |
      | INVALID | g-wagon |   100.0 |         0.01 | invalid account type |
      | HELLO   | house   |   150.0 |         0.03 | invalid account type |
