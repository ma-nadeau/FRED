Feature: Modify Bank Account Details
  As a registered user with an existing bank account, I want to be able to modify my bank account details.

  Background:
    Given the following users exist:
      | userId | name     | email         | password |
      | 1      | user123  | user@test.com | pass123  |
    And the following bank account exists for the user:
      | bankAccountId | userId | name         | balance |
      | 101           | 1      | Savings      | 5000.00 |

  Scenario: User successfully modifies the bank account name
    Given the user is logged in as "user123"
    And the user navigates to the "Modify Bank Account" page
    When the user updates the bank account name to "Emergency Savings"
    And the user submits the changes
    Then the bank account name should be updated to "Emergency Savings"
    And the user should see a confirmation message "Bank account details updated successfully"

  Scenario: User submits invalid input for the bank account name
    Given the user is logged in as "user123"
    And the user navigates to the "Modify Bank Account" page
    When the user clears the bank account name field
    And the user submits the changes
    Then the bank account name should not be updated
    And the user should see an error message "Bank account name cannot be empty"

  Scenario: User cancels the modification process
    Given the user is logged in as "user123"
    And the user navigates to the "Modify Bank Account" page
    When the user updates the bank account name to "Emergency Savings"
    And the user clicks the "Cancel" button
    Then the bank account name should remain "Savings"
    And the user should be redirected to the "Home" page