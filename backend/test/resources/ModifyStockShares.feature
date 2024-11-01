Feature: Modify Stock Share
  As a user of Fred, I would like to modify a stock purchase that has been made in my stock/coins purchase collection, so that I can keep my portfolio up to date

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

    Scenario: Successfully attempt to update the current sellPrice of a stock shares in portfolio to properly reflect how the current value of his portfolio
        When the user attempts to update the salling price of a stock share with symbol "<symbol>"in their trading account "<name>" to the current sellPrice "<currentSalesPrice>"
        Then the stock share with symbol "<symbol>", quantity "<quantity>", purchase price "<purchasePrice>", and selling price "<currentSalesPrice>", associated with trading account "<name>" shall exist in the system
        Then the trading account "<name>" will contain the stock share with with symbol "<symbol>", quantity "<quantity>", purchase price "<purchasePrice>", and selling price "<currentSalesPrice>"
        Then the number of different stocks in the trading account "<name>" shall be "1"
    
        Examples:
            | symbol | quantity | purchasePrice | currentSalesPrice |               name |
            |   AAPL |        5 |         100.0 |             125.0 | Self-Directed TFSA |
    
    Scenario: Successfully attempt to update the quantity of a certain stock in their portfolio after having purchased more stocks
        When the user attempts to update the quantity of a stock share with symbol "<symbol>"in their trading account "<name>" by adding the new amount bought "<amountBought>" to the old quantity
        Then the stock share with symbol "<symbol>", quantity "<currentQuantity>", purchase price "<purchasePrice>", and selling price "<currentSalesPrice>", associated with trading account "<name>" shall exist in the system
        Then the trading account "<name>" will contain the stock share with with symbol "<symbol>", quantity "<currentQuantity>", purchase price "<purchasePrice>", and selling price "<currentSalesPrice>"
        Then the number of different stocks in the trading account "<name>" shall be "1"
        Then the balance of trading account "<name>" shall be "500"

    
        Examples:
            | symbol | currentQuantity | purchasePrice | currentSalesPrice |               name | amountBought |
            |   AAPL |              10 |         100.0 |             120.0 | Self-Directed TFSA |            5 |

    Scenario: Successfully attempt to update the quantity of a certain stock in their portfolio after having sold a portion of the stocks
        When the user attempts to update the quantity of a stock share with symbol "<symbol>"in their trading account "<name>" by selling a certain amount of stocks "<amountSold>"
        Then the stock share with symbol "<symbol>", quantity "<currentQuantity>", purchase price "<purchasePrice>", and selling price "<currentSalesPrice>", associated with trading account "<name>" shall exist in the system
        Then the trading account "<name>" will contain the stock share with with symbol "<symbol>", quantity "<currentQuantity>", purchase price "<purchasePrice>", and selling price "<currentSalesPrice>"
        Then the number of different stocks in the trading account "<name>" shall be "1"
        Then the balance of trading account "<name>" shall be "1240"

    
        Examples:
            | symbol | currentQuantity | purchasePrice | currentSalesPrice |               name | amountSold |
            |   AAPL |               3 |         100.0 |             120.0 | Self-Directed TFSA |          2 |

    Scenario: Unsuccessfully attempt to update the quantity of a certain stock in their portfolio after having purchased more stocks at the initial purchase price due to missing amount bought
        When the user attempts to update the quantity of a stock share with symbol "<symbol>"in their trading account "<name>" by adding the new amount bought "<amountBought>" to the old quantity
        Then the stock share with symbol "<symbol>", quantity "<currentQuantity>", purchase price "<purchasePrice>", and selling price "<currentSalesPrice>", associated with trading account "<name>" shall exist in the system
        Then the trading account "<name>" will contain the stock share with with symbol "<symbol>", quantity "<currentQuantity>", purchase price "<purchasePrice>", and selling price "<currentSalesPrice>"
        Then the number of different stocks in the trading account "<name>" shall be "1"
        Then the error "<error>" shall be raised

        Examples:
            | symbol | currentQuantity | purchasePrice | currentSalesPrice |               name | amountBought |                 error |
            |   AAPL |               5 |         100.0 |             120.0 | Self-Directed TFSA |              | Missing amount bought |
    
    Scenario: Unsuccessfully attempt to update the quantity of a certain stock in their portfolio after having purchased more stocks at the initial purchase price due to missing symbol
        When the user attempts to update the quantity of a stock share with symbol "<symbol>"in their trading account "<name>" by adding the new amount bought "<amountBought>" to the old quantity
        Then the stock share with symbol "<symbol>", quantity "<currentQuantity>", purchase price "<purchasePrice>", and selling price "<currentSalesPrice>", associated with trading account "<name>" shall exist in the system
        Then the trading account "<name>" will contain the stock share with with symbol "<symbol>", quantity "<currentQuantity>", purchase price "<purchasePrice>", and selling price "<currentSalesPrice>"
        Then the number of different stocks in the trading account "<name>" shall be "1"
        Then the error "<error>" shall be raised

        Examples:
            | symbol | currentQuantity | purchasePrice | currentSalesPrice |               name | amountBought |          error |
            |        |               5 |         100.0 |             120.0 | Self-Directed TFSA |           5  | Missing symbol |

    Scenario: Unsuccessfully attempt to update the quantity of a certain stock in their portfolio after having purchased more stocks at the initial purchase price due to missing trading account name
        When the user attempts to update the quantity of a stock share with symbol "<symbol>"in their trading account "<name>" by adding the new amount bought "<amountBought>" to the old quantity
        Then the stock share with symbol "<symbol>", quantity "<currentQuantity>", purchase price "<purchasePrice>", and selling price "<currentSalesPrice>", associated with trading account "<name>" shall exist in the system
        Then the trading account "<name>" will contain the stock share with with symbol "<symbol>", quantity "<currentQuantity>", purchase price "<purchasePrice>", and selling price "<currentSalesPrice>"
        Then the number of different stocks in the trading account "<name>" shall be "1"
        Then the error "<error>" shall be raised

        Examples:
            | symbol | currentQuantity | purchasePrice | currentSalesPrice | name | amountBought |                error |
            |   AAPL |               5 |         100.0 |             120.0 |      |           5  | Missing account name |

    Scenario: Unsuccessfully attempt to update the quantity of a certain stock in their portfolio after having purchased more stocks at the initial purchase price due to negative amount bought
        When the user attempts to update the quantity of a stock share with symbol "<symbol>"in their trading account "<name>" by adding the new amount bought "<amountBought>" to the old quantity
        Then the stock share with symbol "<symbol>", quantity "<currentQuantity>", purchase price "<purchasePrice>", and selling price "<currentSalesPrice>", associated with trading account "<name>" shall exist in the system
        Then the trading account "<name>" will contain the stock share with with symbol "<symbol>", quantity "<currentQuantity>", purchase price "<purchasePrice>", and selling price "<currentSalesPrice>"
        Then the number of different stocks in the trading account "<name>" shall be "1"
        Then the error "<error>" shall be raised

        Examples:
            | symbol | currentQuantity | purchasePrice | currentSalesPrice |               name | amountBought |                 error |
            |   AAPL |               5 |         100.0 |             120.0 | Self-Directed TFSA |           -1 | Invalid amount bought |
    
    Scenario: Unsuccessfully attempt to update the quantity of a certain stock in their portfolio after having purchased more stocks at the initial purchase price due to non-existent/incorrect symbol
        When the user attempts to update the quantity of a stock share with symbol "<symbol>"in their trading account "<name>" by adding the new amount bought "<amountBought>" to the old quantity
        Then the stock share with symbol "<symbol>", quantity "<currentQuantity>", purchase price "<purchasePrice>", and selling price "<currentSalesPrice>", associated with trading account "<name>" shall exist in the system
        Then the trading account "<name>" will contain the stock share with with symbol "<symbol>", quantity "<currentQuantity>", purchase price "<purchasePrice>", and selling price "<currentSalesPrice>"
        Then the number of different stocks in the trading account "<name>" shall be "1"
        Then the error "<error>" shall be raised

        Examples:
            | symbol | currentQuantity | purchasePrice | currentSalesPrice |               name | amountBought |          error |
            |  MONEY |               5 |         100.0 |             120.0 | Self-Directed TFSA |           5  | Invalid symbol |

    Scenario: Unsuccessfully attempt to update the quantity of a certain stock in their portfolio after having purchased more stocks at the initial purchase price due to non-existent/incorrect trading account name
        When the user attempts to update the quantity of a stock share with symbol "<symbol>"in their trading account "<name>" by adding the new amount bought "<amountBought>" to the old quantity
        Then the stock share with symbol "<symbol>", quantity "<currentQuantity>", purchase price "<purchasePrice>", and selling price "<currentSalesPrice>", associated with trading account "<name>" shall exist in the system
        Then the trading account "<name>" will contain the stock share with with symbol "<symbol>", quantity "<currentQuantity>", purchase price "<purchasePrice>", and selling price "<currentSalesPrice>"
        Then the number of different stocks in the trading account "<name>" shall be "1"
        Then the error "<error>" shall be raised

        Examples:
            | symbol | currentQuantity | purchasePrice | currentSalesPrice |          name | amountBought |                error |
            |   AAPL |               5 |         100.0 |             120.0 | Doesn't Exist |           5  | Invalid account name |

    Scenario: Unsuccessfully attempt to update the quantity of a certain stock in their portfolio after having sold more stocks than there are in the account
        When the user attempts to update the quantity of a stock share with symbol "<symbol>"in their trading account "<name>" by specifying the amount sold "<amountSold>"
        Then the stock share with symbol "<symbol>", quantity "<currentQuantity>", purchase price "<purchasePrice>", and selling price "<currentSalesPrice>", associated with trading account "<name>" shall exist in the system
        Then the trading account "<name>" will contain the stock share with with symbol "<symbol>", quantity "<currentQuantity>", purchase price "<purchasePrice>", and selling price "<currentSalesPrice>"
        Then the number of different stocks in the trading account "<name>" shall be "1"
        Then the error "<error>" shall be raised

        Examples:
            | symbol | currentQuantity | purchasePrice | currentSalesPrice |               name | amountSold |                                                error |
            |   AAPL |               5 |         100.0 |             120.0 | Self-Directed TFSA |         10 | Trying to remove more stocks than are in the account |
    
    Scenario: Unsuccessfully attempt to update the quantity of a certain stock in their portfolio after having sold stocks due to missing amount bought
        When the user attempts to update the quantity of a stock share with symbol "<symbol>"in their trading account "<name>" by specifying the amount sold "<amountSold>"
        Then the stock share with symbol "<symbol>", quantity "<currentQuantity>", purchase price "<purchasePrice>", and selling price "<currentSalesPrice>", associated with trading account "<name>" shall exist in the system
        Then the trading account "<name>" will contain the stock share with with symbol "<symbol>", quantity "<currentQuantity>", purchase price "<purchasePrice>", and selling price "<currentSalesPrice>"
        Then the number of different stocks in the trading account "<name>" shall be "1"
        Then the error "<error>" shall be raised

        Examples:
            | symbol | currentQuantity | purchasePrice | currentSalesPrice |               name | amountSold |               error |
            |   AAPL |               5 |         100.0 |             120.0 | Self-Directed TFSA |            | Missing amount sold |
    
    Scenario: Unsuccessfully attempt to update the quantity of a certain stock in their portfolio after having sold stocks due to missing symbol
        When the user attempts to update the quantity of a stock share with symbol "<symbol>"in their trading account "<name>" by specifying the amount sold "<amountSold>"
        Then the stock share with symbol "<symbol>", quantity "<currentQuantity>", purchase price "<purchasePrice>", and selling price "<currentSalesPrice>", associated with trading account "<name>" shall exist in the system
        Then the trading account "<name>" will contain the stock share with with symbol "<symbol>", quantity "<currentQuantity>", purchase price "<purchasePrice>", and selling price "<currentSalesPrice>"
        Then the number of different stocks in the trading account "<name>" shall be "1"
        Then the error "<error>" shall be raised

        Examples:
            | symbol | currentQuantity | purchasePrice | currentSalesPrice |               name | amountSold |            error |
            |        |               5 |         100.0 |             120.0 | Self-Directed TFSA |           5  | Missing symbol |

    Scenario: Unsuccessfully attempt to update the quantity of a certain stock in their portfolio after having purchased more stocks at the initial purchase price due to missing trading account name
        When the user attempts to update the quantity of a stock share with symbol "<symbol>"in their trading account "<name>" by specifying the amount sold "<amountSold>"
        Then the stock share with symbol "<symbol>", quantity "<currentQuantity>", purchase price "<purchasePrice>", and selling price "<currentSalesPrice>", associated with trading account "<name>" shall exist in the system
        Then the trading account "<name>" will contain the stock share with with symbol "<symbol>", quantity "<currentQuantity>", purchase price "<purchasePrice>", and selling price "<currentSalesPrice>"
        Then the number of different stocks in the trading account "<name>" shall be "1"
        Then the error "<error>" shall be raised

        Examples:
            | symbol | currentQuantity | purchasePrice | currentSalesPrice | name | amountSold |               error |
            |   AAPL |               5 |         100.0 |             120.0 |      |         5  | Missing acount name |

    Scenario: Unsuccessfully attempt to update the quantity of a certain stock in their portfolio after having sold stocks due to negative amount bought
        When the user attempts to update the quantity of a stock share with symbol "<symbol>"in their trading account "<name>" by specifying the amount sold "<amountSold>"
        Then the stock share with symbol "<symbol>", quantity "<currentQuantity>", purchase price "<purchasePrice>", and selling price "<currentSalesPrice>", associated with trading account "<name>" shall exist in the system
        Then the trading account "<name>" will contain the stock share with with symbol "<symbol>", quantity "<currentQuantity>", purchase price "<purchasePrice>", and selling price "<currentSalesPrice>"
        Then the number of different stocks in the trading account "<name>" shall be "1"
        Then the error "<error>" shall be raised

        Examples:
            | symbol | currentQuantity | purchasePrice | currentSalesPrice |               name | amountSold |               error |
            |   AAPL |               5 |         100.0 |             120.0 | Self-Directed TFSA |        -1  | Invalid amount sold |
    
    Scenario: Unsuccessfully attempt to update the quantity of a certain stock in their portfolio after having sold stocks due to non-existent/incorrect symbol
        When the user attempts to update the quantity of a stock share with symbol "<symbol>"in their trading account "<name>" by specifying the amount sold "<amountSold>"
        Then the stock share with symbol "<symbol>", quantity "<currentQuantity>", purchase price "<purchasePrice>", and selling price "<currentSalesPrice>", associated with trading account "<name>" shall exist in the system
        Then the trading account "<name>" will contain the stock share with with symbol "<symbol>", quantity "<currentQuantity>", purchase price "<purchasePrice>", and selling price "<currentSalesPrice>"
        Then the number of different stocks in the trading account "<name>" shall be "1"
        Then the error "<error>" shall be raised

        Examples:
            | symbol | currentQuantity | purchasePrice | currentSalesPrice |               name | amountSold |            error |
            |  MONEY |               5 |         100.0 |             120.0 | Self-Directed TFSA |           5  | Invalid symbol |

    Scenario: Unsuccessfully attempt to update the quantity of a certain stock in their portfolio after having purchased more stocks at the initial purchase price due to non-existent/incorrect trading account name
        When the user attempts to update the quantity of a stock share with symbol "<symbol>"in their trading account "<name>" by specifying the amount sold "<amountSold>"
        Then the stock share with symbol "<symbol>", quantity "<currentQuantity>", purchase price "<purchasePrice>", and selling price "<currentSalesPrice>", associated with trading account "<name>" shall exist in the system
        Then the trading account "<name>" will contain the stock share with with symbol "<symbol>", quantity "<currentQuantity>", purchase price "<purchasePrice>", and selling price "<currentSalesPrice>"
        Then the number of different stocks in the trading account "<name>" shall be "1"
        Then the error "<error>" shall be raised

        Examples:
            | symbol | currentQuantity | purchasePrice | currentSalesPrice |          name | amountSold |               error |
            |   AAPL |               5 |         100.0 |             120.0 | Doesn't Exist |         5  | Invalid acount name |