Feature: Create User Account
As a prospective user, I want to create a user account.

  Background: 
    Given the following accounts exist in the system
        | name | email | phoneNumber | password |
        |  John Doe |  jdoe@test.com | 5145145145 | Password1# |
        | Jane Deer | jdeer@email.ca | 4384384384 | Password2# |

    Scenario: Successfully create a new user account
    When the user attempts to create a new account with name "<name>", email "<email>", phone number "<phoneNumber>", and password "<password>"
    Then the account with name "<name>", email "<email>", phone number "<phoneNumber>", and password "<password>" shall exist in the system
    Then the number of users in the system shall be "3"
    
    Examples: 
      | name | email | phoneNumber | password |
      | Sebastian Reinhardt | sreinhardt@testemail.ca | 5144313528 | tEstpass12! |
      |              J Cole |         jcole@gmail.com | 5555555555 |   p4sswOrd! |
      |        Lionel Messi |         lmessi@bdor.com | 1010101010 |   B3st3ver! |

    Scenario: Unsuccessfully create a new user account due to missing name
    When the user attempts to create a new account with name "<name>", email "<email>", phone number "<phoneNumber>", and password "<password>"
    Then the account with name "<name>", email "<email>", phone number "<phoneNumber>", and password "<password>" shall not exist in the system
    Then the number of users in the system shall be "2"
    
    Examples: 
      | name | email | phoneNumber | password |
      |  | sreinhardtUN1@testemail.ca | 5144313529 | tEstpass12! |
      |  |         jcoleUN1@gmail.com | 5555555556 |   p4sswOrd! |
      |  |         lmessiUN1@bdor.com | 1010101011 |   B3st3ver! |

    Scenario: Unsuccessfully create a new user account due to missing email
    When the user attempts to create a new account with name "<name>", email "<email>", phone number "<phoneNumber>", and password "<password>"
    Then the account with name "<name>", email "<email>", phone number "<phoneNumber>", and password "<password>" shall not exist in the system
    Then the number of users in the system shall be "2"
    
    Examples: 
      | name | email | phoneNumber | password |
      | Sebastian Reinhardt |  | 5144313520 | tEstpass12! |
      |              J Cole |  | 5555555557 |   p4sswOrd! |
      |        Lionel Messi |  | 1010101012 |   B3st3ver! |

    Scenario: Unsuccessfully create a new user account due to missing phone number
    When the user attempts to create a new account with name <name>, email "<email>", phone number "<phoneNumber>", and password "<password>"
    Then the account with name "<name>", email "<email>", phone number "<phoneNumber>", and password "<password>" shall not exist in the system
    Then the number of users in the system shall be "2"
    
    Examples: 
      | name | email | phoneNumber | password |
      | Sebastian Reinhardt | sreinhardtUN2@testemail.ca |  | tEstpass12! |
      |              J Cole |         jcoleUN2@gmail.com |  |   p4sswOrd! |
      |        Lionel Messi |         lmessiUN2@bdor.com |  |   B3st3ver! |

    Scenario: Unsuccessfully create a new user account due to missing password
    When the user attempts to create a new account with name <name>, email "<email>", phone number "<phoneNumber>", and password "<password>"
    Then the account with name "<name>", email "<email>", phone number "<phoneNumber>", and password "<password>" shall not exist in the system
    Then the number of users in the system shall be "2"
    
    Examples: 
      | name | email | phoneNumber | password |
      | Sebastian Reinhardt | sreinhardtUN2@testemail.ca | 5144313520 |  |
      |              J Cole |         jcoleUN2@gmail.com | 5555555557 |  |
      |        Lionel Messi |         lmessiUN2@bdor.com | 1010101012 |  |

    Scenario: Unsuccessfully create a new user account due to there already being an account associated with the email
    When the user attempts to create a new account with name "<name>", email "<email>", phone number "<phoneNumber>", and password "<password>"
    Then the account with name "<name>", email "<email>", phone number "<phoneNumber>", and password "<password>" shall not exist in the system
    Then the number of users in the system shall be "2"

    Examples: 
      | name | email | phoneNumber | password |
      | Sebastian Reinhardt | jdoe@test.com | 5144313520 | tEstpass12! |