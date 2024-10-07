Feature: Account Log In
As a  user, I want to login to my account.

  Background: 
    Given the following accounts exist in the system
        | name | email | age | password |
        |  John Doe |  jdoe@test.com | 19 | Password1# |
        | Jane Deer | jdeer@email.ca | 33 | Password2# |

    Scenario: Successfully log in to an existing account
    When the user attempts to log in with name "<name>", email "<email>" and password "<password>"
    Then the user with name "<name>", email "<email>", age "<age>" and password "<password>" shall be logged in
    Then the number of users in the system shall be "2"

    Examples: 
        | name | email | age | password |
        |  John Doe |   jdoe@test.com | 19 | Password1# |
        | Jane Deer | jdeer@email.com | 33 | Password2# |

    Scenario: Unsuccessfully log in to an existing account due to incorrect password
    When the user attempts to log in with name "<name>", email "<email>" and password "<password>"
    Then the user with name "<name>", email "<email>" and password "<password>" shall not be logged in
    Then the number of users in the system shall be "2"
    Then the error "<error>" shall be raised

    Examples: 
        | name | email | password | error |
        |  John Doe | jdoe@test.com |  wrong | Incorrect name, email or password |
        | Jane Deer | jdeer@email.ca | wrong | Incorrect name, email or password |

    Scenario: Unsuccessfully log in to an existing account due to incorrect email
    When the user attempts to log in with name "<name>", email "<email>" and password "<password>"
    Then the user with name "<name>", email "<email>" and password "<password>" shall not be logged in
    Then the number of users in the system shall be "2"
    Then the error "<error>" shall be raised

    Examples: 
        | name | email | password | error |
        |  John Doe |  wrong@wrong.com | Password1# | Incorrect name, email or password |
        | Jane Deer | nogood@email.org | Password2# | Incorrect name, email or password |

    Scenario: Unsuccessfully log in to an existing account due to missing email
    When the user attempts to log in with name "<name>", email "<email>" and password "<password>"
    Then the user with name "<name>", email "<email>" and password "<password>" shall not be logged in
    Then the number of users in the system shall be "2"
    Then the error "<error>" shall be raised

    Examples: 
        | name | email | password | error |
        |  John Doe |  | Password1# | Email is required |
        | Jane Deer |  | Password2# | Email is required |

    Scenario: Unsuccessfully log in to an existing account due to incorrect name
    When the user attempts to log in with name "<name>", email "<email>" and password "<password>"
    Then the user with name "<name>", email "<email>" and password "<password>" shall not be logged in
    Then the number of users in the system shall be "2"
    Then the error "<error>" shall be raised

    Examples: 
        | name | email | password | error |
        |     wrong |  jdoe@test.com | Password1# | Incorrect name, email or password |
        | wrongName | jdeer@email.ca | Password2# | Incorrect name, email or password |