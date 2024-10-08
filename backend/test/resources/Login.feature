Feature: Account Log In
As a  user, I want to login to my account.

  Background: 
    Given the following accounts exist in the system
        | name | email | age | password |
        |  John Doe |  jdoe@test.com | 19 | Password1# |
        | Jane Deer | jdeer@email.ca | 33 | Password2# |

    Scenario: Successfully log in to an existing account
    When the user attempts to log in with email "<email>" and password "<password>"
    Then the user with name "<name>", email "<email>", age "<age>" and password "<password>" shall be logged in
    Then the number of users in the system shall be "2"

    Examples: 
        | email | age | password |
        |   jdoe@test.com | 19 | Password1# |
        | jdeer@email.com | 33 | Password2# |

    Scenario: Unsuccessfully log in to an existing account due to incorrect password
    When the user attempts to log in with email "<email>" and password "<password>"
    Then the user with email "<email>" and password "<password>" shall not be logged in
    Then the number of users in the system shall be "2"
    Then the error "<error>" shall be raised

    Examples: 
        | email | password | error |
        | jdoe@test.com |  wrong | Incorrect name, email or password |
        | jdeer@email.ca | wrong | Incorrect name, email or password |

    Scenario: Unsuccessfully log in to an existing account due to incorrect email
    When the user attempts to log in with email "<email>" and password "<password>"
    Then the user with email "<email>" and password "<password>" shall not be logged in
    Then the number of users in the system shall be "2"
    Then the error "<error>" shall be raised

    Examples: 
        | email | password | error |
        |  wrong@wrong.com | Password1# | Incorrect name, email or password |
        | nogood@email.org | Password2# | Incorrect name, email or password |

    Scenario: Unsuccessfully log in to an existing account due to missing email
    When the user attempts to log in with email "<email>" and password "<password>"
    Then the user with email "<email>" and password "<password>" shall not be logged in
    Then the number of users in the system shall be "2"
    Then the error "<error>" shall be raised

    Examples: 
        | email | password | error |
        |  | Password1# | Email is required |
        |  | Password2# | Email is required |
