Feature: Add Stock Share
  As a user of Fred, I would like to add shares of a stock given the ticker/crypto symbol, number of shares/coins and purchase price, so that I can add the stocks to my portfolio

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
    
    Scenario: Successfully attempt to add stock shares to portfolio
        When the user "<userId>" attempts to add stock share with symbol "<symbol>", quantity "<quantity>", purchase price "<purchasePrice>" to their trading account "<name>"
        Then the stock share with symbol "<symbol>", quantity "<quantity>", and purchase price "<purchasePrice>", associated with trading account "<name>" shall exist in the system
        Then the trading account "<name>" will contain the stock share with with symbol "<symbol>", quantity "<quantity>", and purchase price "<purchasePrice>"
        Then the number of different stocks in the trading account "<name>" shall be "2"
        Then the balance of trading account "<name>" shall be "580"
    
        Examples:
            | userId | symbol | quantity | purchasePrice |               name |
            |      1 | AC     |      20 |             21 | Self-Directed TFSA |
    
    Scenario: Unsuccessfully attempt to add stock shares to portfolio due to missing symbol
        When the user "<userId>" attempts to add stock share with symbol "<symbol>", quantity "<quantity>", purchase price "<purchasePrice>" to their trading account "<name>"
        Then the stock share with symbol "<symbol>", quantity "<quantity>", and purchase price "<purchasePrice>", associated with trading account "<name>" shall not exist in the system
        Then the number of different stocks in the trading account "<name>" shall be "1"
        Then the error "<error>" shall be raised

        Examples:
            | userId | symbol | quantity | purchasePrice |               name | error |
            |      1 |        |      20 |             21 | Self-Directed TFSA | Missing symbol |

    Scenario: Unsuccessfully attempt to add stock shares to portfolio due to not specifying the quantity
        When the user "<userId>" attempts to add stock share with symbol "<symbol>", quantity "<quantity>", purchase price "<purchasePrice>" to their trading account "<name>"
        Then the stock share with symbol "<symbol>", quantity "<quantity>", and purchase price "<purchasePrice>", associated with trading account "<name>" shall not exist in the system
        Then the number of different stocks in the trading account "<name>" shall be "1"
        Then the error "<error>" shall be raised

        Examples:
            | userId | symbol | quantity | purchasePrice |               name | error |
            |      1 | AC     |          |            21 | Self-Directed TFSA | Missing quantity |

    Scenario: Unsuccessfully attempt to add stock shares to portfolio due to not specifying the purchasePrice
        When the user "<userId>" attempts to add stock share with symbol "<symbol>", quantity "<quantity>", purchase price "<purchasePrice>" to their trading account "<name>"
        Then the stock share with symbol "<symbol>", quantity "<quantity>", and purchase price "<purchasePrice>", associated with trading account "<name>" shall not exist in the system
        Then the number of different stocks in the trading account "<name>" shall be "1"
        Then the error "<error>" shall be raised

        Examples:
            | userId | symbol | quantity | purchasePrice |               name | error |
            |      1 | AC     |      20  |               | Self-Directed TFSA | Missing purchase price |

    Scenario: Unsuccessfully attempt to add stock shares to portfolio due to not specifying the target trading account
        When the user "<userId>" attempts to add stock share with symbol "<symbol>", quantity "<quantity>", purchase price "<purchasePrice>" to their trading account "<name>"
        Then the stock share with symbol "<symbol>", quantity "<quantity>", and purchase price "<purchasePrice>", associated with trading account "<name>" shall not exist in the system
        Then the number of different stocks in the trading account "<name>" shall be "1"
        Then the error "<error>" shall be raised

        Examples:
            | userId | symbol | quantity | purchasePrice | name | error |
            |      1 | AC     |      20  |            21 |      | Missing account name |

    Scenario: Unsuccessfully attempt to add stock shares to portfolio due to non-existent/incorrect symbol
        When the user "<userId>" attempts to add stock share with symbol "<symbol>", quantity "<quantity>", purchase price "<purchasePrice>" to their trading account "<name>"
        Then the stock share with symbol "<symbol>", quantity "<quantity>", and purchase price "<purchasePrice>", associated with trading account "<name>" shall not exist in the system
        Then the number of different stocks in the trading account "<name>" shall be "1"
        Then the error "<error>" shall be raised

        Examples:
            | userId | symbol | quantity | purchasePrice |               name | error |
            |      1 |  MONEY |      20 |             21 | Self-Directed TFSA | Invalid symbol |

    Scenario: Unsuccessfully attempt to add stock shares to portfolio due to negative quantity
        When the user "<userId>" attempts to add stock share with symbol "<symbol>", quantity "<quantity>", purchase price "<purchasePrice>" to their trading account "<name>"
        Then the stock share with symbol "<symbol>", quantity "<quantity>", and purchase price "<purchasePrice>", associated with trading account "<name>" shall not exist in the system
        Then the number of different stocks in the trading account "<name>" shall be "1"
        Then the error "<error>" shall be raised

        Examples:
            | userId | symbol | quantity | purchasePrice |               name | error |
            |      1 | AC     |       -1 |            21 | Self-Directed TFSA | Invalid quantity |

    Scenario: Unsuccessfully attempt to add stock shares to portfolio due to negative purchasePrice
        When the user "<userId>" attempts to add stock share with symbol "<symbol>", quantity "<quantity>", purchase price "<purchasePrice>" to their trading account "<name>"
        Then the stock share with symbol "<symbol>", quantity "<quantity>", and purchase price "<purchasePrice>", associated with trading account "<name>" shall not exist in the system
        Then the number of different stocks in the trading account "<name>" shall be "1"
        Then the error "<error>" shall be raised

        Examples:
            | userId | symbol | quantity | purchasePrice |               name | error |
            |      1 | AC     |      20  |          -100 | Self-Directed TFSA | Invalid purchase price |

    Scenario: Unsuccessfully attempt to add stock shares to portfolio due to non-existent/incorrect target trading account
        When the user "<userId>" attempts to add stock share with symbol "<symbol>", quantity "<quantity>", purchase price "<purchasePrice>" to their trading account "<name>"
        Then the stock share with symbol "<symbol>", quantity "<quantity>", and purchase price "<purchasePrice>", associated with trading account "<name>" shall not exist in the system
        Then the number of different stocks in the trading account "<name>" shall be "1"
        Then the error "<error>" shall be raised

        Examples:
            | userId | symbol | quantity | purchasePrice |        name | error |
            |      1 | AC     |      20  |            21 | Don't Exist | Missing account name |