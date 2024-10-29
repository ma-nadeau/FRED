Feature: Delete Bank Account
  As a registered user with a linked bank account, I want to be able to delete my bank account.

  Background:
    Given the following user account exists in the system
      | userId | name    | email         | password |
      | 1      | user123 | user@test.com | pass123  |
    And the following bank accounts exist in the system for this user
      | bankAccountId | userId | type     | name     | balance |
      | 101           | 1      | Savings  | mortgage | 5000.00 |
      | 102           | 1      | Checking | personal | 2500.00 |
    And the following transactions are linked with this bank account
      | id | accountId | amount | transactionAt       | type       | description   | subscriptionId |
      | 1  | 101       | 200.0  | 2020-01-02 00:00:05 | DEPOSIT    | salary        | 1              |
      | 2  | 102       | 50.0   | 2020-01-03 00:00:10 | WITHDRAWAL | movie tickets | null           |
      | 3  | 101       | 100.0  | 2020-01-04 00:00:15 | DEPOSIT    | salary        | 2              |

  Scenario: User successfully deletes their bank account
    When the user tries to delete the bank account with the bankAccountId "<bankAccountId>", userId "<userId>", type "<type>", name "<name>" and balance "<balance>"
      | bankAccountId | userId | type     | name     | balance |
      | 102           | 1      | Checking | personal | 2500.00 |

    Then the bank account with the bankAccountId "<bankAccountId>", userId "<userId>", type "<type>", name "<name>", and balance "<balance>" shall no longer exist in the system
    Then the number of accounts linked to that user in the system shall be "1"
    Then the transactions with accountId "<bankAccountId>"shall no longer exist in the system

    Examples:
      | id | accountId | amount | transactionAt       | type       | description   | subscriptionId |
      | 2  | 102       | 50.0   | 2020-01-03 00:00:10 | WITHDRAWAL | movie tickets | null           |

  Scenario: User fails to delete a bank account
    When the user tries to delete the bank account with the bankAccountId "<bankAccountId>", userId "<userId>", type "<type>", name "<name>" and balance "<balance>"
    And the bank account with the bankAccountId "<bankAccountId>", userId "<userId>", type "<type>", name "<name>", and balance "<balance>" does not exist in the system
    Then the number of accounts linked to that user in the system shall remain "2"
    Then the error "<error>" shall be raised

    Examples:
      | bankAccountId | userId | type     | name     | balance | error                       |
      | 101           | 1      | Savings  | mortgage | 5000.00 |                             |
      | 102           | 1      | Checking | personal | 2500.00 |                             |
      | 100           | 1      | Savings  | car      | 2000.00 | bank account does not exist |
