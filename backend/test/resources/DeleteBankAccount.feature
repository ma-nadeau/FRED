Feature: Delete Bank Account
  As a registered user with a linked bank account, I want to be able to delete my bank account.

  Background:
    Given the following users exist:
      | userId | name     | email         | password |
      | 1      | user123  | user@test.com | pass123  |
    And the following bank accounts exist:
      | bankAccountId | userId | name         | balance |
      | 101           | 1      | Savings      | 5000.00 |
      | 102           | 1      | Checking     | 2500.00 |

  Scenario: User successfully deletes their bank account
    Given the user is logged in as "user123"
    And the user navigates to the "Manage Bank Accounts" page
    When the user chooses to delete the bank account "Savings"
    Then a prompt should appear asking the user to confirm their choice
    When the user confirms the deletion
    Then the bank account "Savings" should no longer exist
    And the user should see a confirmation message "Bank account deleted successfully"

  Scenario: User cancels the deletion process
    Given the user is logged in as "user123"
    And the user navigates to the "Manage Bank Accounts" page
    When the user chooses to delete the bank account "Checking"
    Then a prompt should appear asking the user to confirm their choice
    And the user cancels the deletion
    Then the bank account "Checking" should still exist
    And the user should be redirected to the "Home" page