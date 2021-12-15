# exchanges-layers

Module that monitors the prices of various crypto-currencies on various exchanges to determine the best exchanges platforms for buying or selling (_arbitrage_).


## Architecture

This module consists of the following layers:
- **exchanges data service layer**: the public APIs of the monitored exchanges platforms.
- **exchanges adapter service layer**: requests the prices on the various exchanges and performs marshalling on the data.
- **exchanges business logic layer**: computes the current best exchange to buy/sell, builds the chart of the historical data of the prices on the exchanges, analyzes the prices for detecting peaks/lows.
- **exchanges process centric layer**: orchestrates the requests of the whole system depending on the favourite coins of the user.

## Exchanges APIs

This module currently monitors the following exchanges platfroms through their APIs:
- **Kraken**: see https://docs.kraken.com/rest/#operation/getTickerInformation, e.g. https://api.kraken.com/0/public/Ticker?pair=BTCUSD
- **Binance**: see https://github.com/binance/binance-spot-api-docs/blob/master/rest-api.md#symbol-price-ticker, e.g. https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT
- **Coinbase**: see https://developers.coinbase.com/api/v2#get-buy-price, e.g. https://api.coinbase.com/v2/prices/BTC-USD/buy
- **FTX**: see https://docs.ftx.com/#markets, e.g. https://ftx.com/api/markets/BTC/USD
- **crypto.com**: see https://exchange-docs.crypto.com/spot/index.html#public-get-ticker, e.g. https://api.crypto.com/v2/public/get-ticker?instrument_name=BTC_USDT
