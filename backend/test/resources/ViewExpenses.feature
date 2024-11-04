Feature: View expenses
As a user of fred, i would like to be able to view my past expenses in a bar chart over 1month, 3 months, 1 year, and all, so that I can vizualize my expenses and see which category takes up the most money

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
      | id | type         | name      | balance | interestRate | mainAccountId |
      |  1 | SAVINGS_TFSA | car       |   150.0 |         0.02 |             1 |
      |  2 | CHECKING     | daily use |   200.0 |         0.01 |             1 |
      |  3 | CHECKING     | personal  |   250.0 |         0.01 |             2 |
    And the following transactions are linked with this bank account
      | id | accountId | amount | transactionAt       | type       | description      | recurringCashFlows |
      |  1 |         2 |   30.0 | 2020-01-03 00:00:10 | WITHDRAWAL | groceries        | null               |
      |  2 |         2 |   50.0 | 2020-01-03 00:00:10 | WITHDRAWAL | movie tickets    | null               |
      |  3 |         2 |  150.0 | 2020-01-10 12:00:20 | WITHDRAWAL | dinner           | null               |
      |  4 |         3 |  150.0 | 2020-01-10 12:00:20 | WITHDRAWAL | kitchen supplies | null               |
      |  5 |         2 |  200.0 | 2020-01-10 12:00:20 | DEPOSIT    | salary           | null               |

  Scenario: Successfully view expenses
    When the user attempts to view expenses with the type WITHDRAWAL, in accountName "<accountName>", account type "<accountType>", linked with user "<userId>", with period "<period>"
    Then the bank account with accounName "<accountName>" shall exist in the system
    Then the system will display the expenses "<>" for the given period

    Examples:
      | userId | accountType | accountName | period | expenses  |
      |      1 | CHECKING    | daily use   |     1M | [1, 2, 3] |

  Scenario: Unsuccessfully view expenses due to wrong account name
    Then the bank account with accounName "<accountName>" shall not exist in the system
    Then the system will display the expenses "<>" for the given period
    Then the error "<error>" shall be raised

    Examples:
      | userId | accountType | accountName | period | expenses  | error                         |
      |      1 | CHECKING    | wrong       |     1M | [1, 2, 3] | wrong or missing account name |
