Feature: Modify Bank Account Details
  As a registered user with an existing bank account, I want to be able to modify my bank account details.

  Background:
    Given the following user account exists in the system
      | userId | name     | email         | password |
      | 1      | user123  | user@test.com | pass123  |
    And the following bank accounts exist in the system
      | bankAccountId | userId | type     | name     | balance |
      | 101           | 1      | Savings  | mortgage | 5000.00 |
      | 102           | 1      | Checking | personal | 2500.00 |

  Scenario: User successfully modifies the bank account name
    When the user tries to modify the name of the bank account with the bankAccountId <"bankAccountId">, userId <"userId">, and name "<name>" to name <"newName">
    Then the bank account with the bankAccountId <"bankAccountId"> and userId <"userId"> shall have the name <"newName">
    
  Examples:
    | bankAccountId | userId | type     | name     | balance |
    | 101           | 1      | Savings  | mortgage | 5000.00 |
    | 102           | 1      | Checking | checking | 2500.00 |

  Scenario: User unsuccessfully modifies the bank account name due to missing name
    When the user tries to modify the name of the bank account with the bankAccountId <"bankAccountId">, userId <"userId">, and name "<name>" to name <"newName">
    Then the bank account with bankAccountId <"bankAccountId">, userId <"userId">, and name "<newName>" shall not exist in the system
    Then the error "<error>" shall be raised

  Examples:
      | bankAccountId | userId | type     | name     | balance | error |
      | 101           | 1      | Savings  | mortgage | 5000.00 | name cannot be empty |
      | 102           | 1      | Checking | personal | 2500.00 | name cannot be empty |
  
  Scenario: User unsuccessfully modifies the bank account name due to invalid name
    When the user tries to modify the name of the bank account with the bankAccountId <"bankAccountId">, userId <"userId">, and name "<name>" to name <"newName">
    Then the bank account with the bankAccountId <"bankAccountId">, userId <"userId"> and name "<newName>" shall not exist in the system
    Then the error "<error>" shall be raised

    Examples:
      | bankAccountId | userId | type     | name     | balance | error |
      | 101           | 1      | Savings  | mortgage | 5000.00 | invalid name |
      | 102           | 1      | Checking | personal | 2500.00 | invalid name |

