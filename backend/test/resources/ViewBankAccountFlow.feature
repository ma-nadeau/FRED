Feature: View Bank Account Flow
As a user of Fred, I want to view my bank account flow including 1 month, 3 months, 1 year, 5 years, and all time periods, so I can visualize the interaction between my income and expenses.

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
      | id | type     | name      | balance | interestRate |
      |  1 | CHECKING | daily use |   150.0 |         0.02 |
    Given the following transactions are linked with this bank account
      | id | accountId | amount | transactionAt       | type       | description | recurringCashFlows |
      |  1 |         1 |  100.0 | 2020-01-01 00:00:00 | WITHDRAWAL | groceries   | null               |
      |  2 |         1 |  200.0 | 2020-01-02 00:00:05 | DEPOSIT    | salary      |                  1 |
    Given the following recurringCashFlows are linked with this bank account
      | id | accountId | name   | amount | isActive | frequency |
      |  1 |         1 | salary |  200.0 | true     | WEEKLY    |

  Scenario: Successfully View Account Flow
    When the user attempts to view an account flow with account name "<accountName>", account type "<accountType>", period "<period>"
    Then the bank account with accountName "<accountName>", account type "<accountType>" shall exist in the system
    Then the system will display the transactions "<transactions>" for the given period

    Examples:
      | accountType | accountName | period | transactions |
      | CHECKING    | daily use   |     1M | [1, 2]       |

  Scenario: Unsuccessfully View Account Flow due to wrong account name
    When the user attempts to view an account flow with account name "<accountName>", account type "<accountType>", period "<period>"
    Then the bank account with accountName "<accountName>", account type "<accountType>" shall not exist in the system
    Then the error "<error>" shall be raised

    Examples:
      | accountType | accountName | period | transactions | error                         |
      | CHECKING    | wrong       |     1M | [1, 2]       | wrong or missing account name |
