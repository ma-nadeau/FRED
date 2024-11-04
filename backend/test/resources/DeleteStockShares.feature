Feature: Delete Stock Share
  As a user of Fred, I would like to delete a viewing stock from my protfolio, so that when I have no more shares in a specific stock it is no longer in the system's portfolio

    Background:
        Given the following user account exist in the system
            | id | name     | email         | age |
            |  1 | John Doe | jdoe@test.com |  67 |
        Given the following main account exists in the system
            | id | userId | type | accountId | institution                |
            |  1 |      1 | BANK |         1 | Banque Nationale du Canada |
        Given the following user is logged in
            | id | name     | email         |
            |  1 | John Doe | jdoe@test.com |
        Given the following bank account exists in the system for this user
            | id | type     | name      | balance | interestRate |
            |  1 | CHECKING | daily use |   150.0 |         0.02 |
        Given the following trade accounts exist in the system
            | id | userId | name | balance | type |
            |  1 |      1 | Self-Directed TFSA |  1000.0 | TFSA |
        Given the following stock shares exist in the system in the user's portfolio
            | id | tradeAccountId | symbol | purchasePrice | sellPrice | quantity | transactionAt |
            |  1 |              1 | AAPL   |         100.0 |     120.0 |        5 | 2024-11-01 15:15:15 |

    Scenario: Successfully delete stock share from portfolio
        When the user "<userId>" attempts to delete stock shares from their trading account "<name>" with symbol "<symbol>"
        Then the stock share with symbol "<symbol>", associated with trading account "<name>" shall not exist in the system
        Then the number of different stocks in the trading account "<name>" shall be "0"
        Then the balance of trading account "<name>" shall be "1600"
        
        Examples: 
            | userId | symbol | name |
            |      1 | AAPL   | Self-Directed TFSA |

    Scenario: Unsuccessfully delete stock share from portfolio due to missing symbol
        When the user "<userId>" attempts to delete stock shares from their trading account "<name>" with symbol "<symbol>"
        Then the stock share with symbol "<symbol>", associated with trading account "<name>" shall exist in the system
        Then the number of different stocks in the trading account "<name>" shall be "1"
        Then the error "<error>" shall be raised

        Examples: 
            | userId | symbol |               name |          error |
            |      1 |        | Self-Directed TFSA | Missing symbol |

    Scenario: Unsuccessfully delete stock share from portfolio due to missing trading account name
        When the user "<userId>" attempts to delete stock shares from their trading account "<name>" with symbol "<symbol>"
        Then the stock share with symbol "<symbol>", associated with trading account "<name>" shall exist in the system
        Then the number of different stocks in the trading account "<name>" shall be "1"
        Then the error "<error>" shall be raised

        Examples: 
            | userId | symbol | name |                        error |
            |      1 | AAPL   |      | Missing trading account name |

    Scenario: Unsuccessfully delete stock share from portfolio due to incorrect/non-existent symbol
        When the user "<userId>" attempts to delete stock shares from their trading account "<name>" with symbol "<symbol>"
        Then the stock share with symbol "<symbol>", associated with trading account "<name>" shall exist in the system
        Then the number of different stocks in the trading account "<name>" shall be "1"
        Then the error "<error>" shall be raised

        Examples: 
            | userId | symbol |               name |             error |
            |      1 |  MONEY | Self-Directed TFSA | Nonexistent share |

    Scenario: Unsuccessfully delete stock share from portfolio due to incorrect/non-existent trading account name
        When the user "<userId>" attempts to delete stock shares from their trading account "<name>" with symbol "<symbol>"
        Then the stock share with symbol "<symbol>", associated with trading account "<name>" shall exist in the system
        Then the number of different stocks in the trading account "<name>" shall be "1"
        Then the error "<error>" shall be raised

        Examples: 
            | userId | symbol |     name |               error |
            |      1 | AAPL   | NotExist | Nonexistent account |