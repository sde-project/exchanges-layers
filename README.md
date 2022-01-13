# exchanges-layers

Module that monitors the prices of various crypto-currencies on various exchanges to determine the best exchanges platforms for buying or selling (_arbitrage_).


## Architecture
This module consists of the following layers:
- **exchanges data service layer**: the public APIs of the monitored exchanges platforms.
- **exchanges adapter service layer**: requests the prices on the various exchanges and performs marshalling on the data for storage in MongoDB.
- **exchanges business logic layer**: computes the current best exchange to buy/sell and analyzes the prices for detecting peaks/lows.
- **exchanges process centric layer**: orchestrates the requests of the whole system depending on the favourite coins of the user, exposes data to the front-end and forwards notifications.

## Data
### Crypto-currencies
This module monitors the following crypto-currencies: BTC, ETH, LTC, SOL, XRP, AVAX, DOGE, BNB, DOT and LUNA.

### Exchanges APIs
This module currently monitors the following exchanges platfroms through their APIs:
- **Kraken**: see https://docs.kraken.com/rest/#operation/getTickerInformation, e.g. https://api.kraken.com/0/public/Ticker?pair=BTCUSD
- **Binance**: see https://github.com/binance/binance-spot-api-docs/blob/master/rest-api.md#symbol-price-ticker, e.g. https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT
- **Coinbase**: see https://developers.coinbase.com/api/v2#get-buy-price, e.g. https://api.coinbase.com/v2/prices/BTC-USD/buy
- **FTX**: see https://docs.ftx.com/#markets, e.g. https://ftx.com/api/markets/BTC/USD
- **crypto.com**: see https://exchange-docs.crypto.com/spot/index.html#public-get-ticker, e.g. https://api.crypto.com/v2/public/get-ticker?instrument_name=BTC_USDT
