Feature: Create User Account
As a prospective user, I want to create a user account.

  Background: 
    Given the following accounts exist in the system
        | id | name | email | age | password | createdAt | updatedAt |
        | 1  |  John Doe |  jdoe@test.com | 25 | Password1# | 2023-01-01 00:00:00 | 2023-02-02 00:00:00 |
        | 2  | Jane Deer | jdeer@email.ca | 64 | Password2# | 2022-06-07 00:00:00 | 2024-06-07 00:00:00 |

    Scenario: Successfully create a new user account
    When the user attempts to create a new account with name "<name>", email "<email>", age "<age>", and password "<password>"
    Then the account with name "<name>", email "<email>", age "<age>", and password "<password>" shall exist in the system
    Then the number of users in the system shall be "3"
    
    Examples: 
      | name | email | age | password |
      | Sebastian Reinhardt | sreinhardt@testemail.ca | 19 | tEstpass12! |
      |              J Cole |         jcole@gmail.com | 33 |   p4sswOrd! |
      |        Lionel Messi |         lmessi@bdor.com | 45 |   B3st3ver! |

    Scenario: Unsuccessfully create a new user account due to missing name
    When the user attempts to create a new account with name "<name>", email "<email>", age "<age>", and password "<password>"
    Then the account with name "<name>", email "<email>", age "<age>", and password "<password>" shall not exist in the system
    Then the number of users in the system shall be "2"
    Then the error "<error>" shall be raised
    
    Examples: 
      | name | email | age | password | error |
      |  | sreinhardtUN1@testemail.ca | 19 | tEstpass12! | Name is required |
      |  |         jcoleUN1@gmail.com | 33 |   p4sswOrd! | Name is required |
      |  |         lmessiUN1@bdor.com | 45 |   B3st3ver! | Name is required |

    Scenario: Unsuccessfully create a new user account due to missing email
    When the user attempts to create a new account with name "<name>", email "<email>", age "<age>", and password "<password>"
    Then the account with name "<name>", email "<email>", age "<age>", and password "<password>" shall not exist in the system
    Then the number of users in the system shall be "2"
    Then the error "<error>" shall be raised
    
    Examples: 
      | name | email | age | password | error |
      | Sebastian Reinhardt |  | 19 | tEstpass12! | Email is required |
      |              J Cole |  | 33 |   p4sswOrd! | Email is required |
      |        Lionel Messi |  | 45 |   B3st3ver! | Email is required |

    Scenario: Unsuccessfully create a new user account due to missing age
    When the user attempts to create a new account with name <name>, email "<email>", age "<age>", and password "<password>"
    Then the account with name "<name>", email "<email>", age "<age>", and password "<password>" shall not exist in the system
    Then the number of users in the system shall be "2"
    Then the error "<error>" shall be raised
    
    Examples: 
      | name | email | age | password | error |
      | Sebastian Reinhardt | sreinhardtUN2@testemail.ca |  | tEstpass12! | age is required |
      |              J Cole |         jcoleUN2@gmail.com |  |   p4sswOrd! | age is required |
      |        Lionel Messi |         lmessiUN2@bdor.com |  |   B3st3ver! | age is required |

    Scenario: Unsuccessfully create a new user account due to missing password
    When the user attempts to create a new account with name <name>, email "<email>", age "<age>", and password "<password>"
    Then the account with name "<name>", email "<email>", age "<age>", and password "<password>" shall not exist in the system
    Then the number of users in the system shall be "2"
    Then the error "<error>" shall be raised
    
    Examples: 
      | name | email | age | password | error |
      | Sebastian Reinhardt | sreinhardtUN2@testemail.ca | 19 |  | Password is required |
      |              J Cole |         jcoleUN2@gmail.com | 33 |  | Password is required |
      |        Lionel Messi |         lmessiUN2@bdor.com | 45 |  | Password is required |

    Scenario: Unsuccessfully create a new user account due to there already being an account associated with the email
    When the user attempts to create a new account with name "<name>", email "<email>", age "<age>", and password "<password>"
    Then the account with name "<name>", email "<email>", age "<age>", and password "<password>" shall not exist in the system
    Then the number of users in the system shall be "2"
    Then the error "<error>" shall be raised

    Examples: 
      | name | email | age | password | error |
      | Sebastian Reinhardt | jdoe@test.com | 19 | tEstpass12! | Email is already associated with an account |