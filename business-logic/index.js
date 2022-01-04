require('dotenv').config();

const express = require('express');
const app = express();

const PORT = process.env.PORT || 2902;

const axios = require('axios');

const Price = require('./model/Price');

const EXCHANGES = ['Kraken', 'Binance', 'Coinbase', 'FTX', 'Crypto.com'];
const CRYPTOS = ['BTC', 'ETH', 'BNB', 'SOL', 'DOGE', 'XRP', 'DOT', 'AVAX', 'LTC', 'LUNA'];
const OPERATIONS = ['buy', 'sell'];

app.use(express.json());

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res, next) => {
    if (req.header('Authorization') !== process.env.BUSINESS_LOGIC_KEY) {
        return res.status(401).send({ statusCode: 401, message: "unauthorized" });
    } else {
        next();
    }
});

app.get('/exchange/best/operation/:operation/crypto/:crypto', (req, res) => {
    const crypto = req.params.crypto;
    const operation = req.params.operation;
    if (!CRYPTOS.includes(crypto)) {
        res.status(404).send({ statusCode: 404, message: 'crypto not found' });
    } else if (!OPERATIONS.includes(operation)) {
        res.status(404).send({ statusCode: 404, message: 'operation not found' });
    } else {
        switch (crypto) {
            case 'BTC':
            case 'ETH':
            case 'SOL':
            case 'LTC':
            case 'DOGE':
            case 'DOT':
                var requests = [];
                var exchanges = ['Kraken', 'Coinbase', 'Binance', 'FTX', 'Crypto.com'];
                exchanges.forEach(exchange => {
                    requests.push(createRequest(crypto, operation, exchange));
                });

                Promise.all(requests)
                    .then(([latestKraken, latestBinance, latestCoinbase, latestFTX, latestCrypto]) => {
                        let bestExchange = latestKraken;

                        console.log('Kraken ' + operation + ' ' + crypto + ' at ' + latestKraken.price + '$');
                        console.log('Coinbase ' + operation + ' ' + crypto + ' at ' + latestCoinbase.price + '$');
                        console.log('Binance ' + operation + ' ' + crypto + ' at ' + latestBinance.price + '$');
                        console.log('FTX ' + operation + ' ' + crypto + ' at ' + latestFTX.price + '$');
                        console.log('Crypto.com ' + operation + ' ' + crypto + ' at ' + latestCrypto.price + '$');

                        if (operation == 'buy') {
                            if (latestBinance.price < bestExchange.price) {
                                bestExchange = latestBinance;
                            }
                            if (latestCoinbase.price < bestExchange.price) {
                                bestExchange = latestCoinbase;
                            }
                            if (latestFTX.price < bestExchange.price) {
                                bestExchange = latestFTX;
                            }
                            if (latestCrypto.price < bestExchange.price) {
                                bestExchange = latestCrypto;
                            }
                        } else {
                            if (latestBinance.price > bestExchange.price) {
                                bestExchange = latestBinance;
                            }
                            if (latestCoinbase.price > bestExchange.price) {
                                bestExchange = latestCoinbase;
                            }
                            if (latestFTX.price > bestExchange.price) {
                                bestExchange = latestFTX;
                            }
                            if (latestCrypto.price > bestExchange.price) {
                                bestExchange = latestCrypto;
                            }
                        }

                        res.status(200).send(bestExchange);
                    })
                    .catch(e => console.log(e));
                break;
            case 'BNB':
                var requests = [];
                var exchanges = ['Binance', 'FTX'];
                exchanges.forEach(exchange => {
                    requests.push(createRequest(crypto, operation, exchange));
                });

                Promise.all(requests)
                    .then(([latestBinance, latestFTX]) => {
                        let bestExchange = latestBinance;
                        console.log('Binance ' + operation + ' ' + crypto + ' at ' + latestBinance.price + '$');
                        console.log('FTX ' + operation + ' ' + crypto + ' at ' + latestFTX.price + '$');

                        if (operation == 'buy') {
                            if (latestFTX.price < bestExchange.price) {
                                bestExchange = latestFTX;
                            }
                        } else {
                            if (latestFTX.price > bestExchange.price) {
                                bestExchange = latestFTX;
                            }
                        }

                        res.status(200).send(bestExchange);
                    })
                    .catch(e => console.log(e));
                break;
            case 'XRP':
                var requests = [];
                var exchanges = ['Kraken', 'Binance', 'FTX', 'Crypto.com'];
                exchanges.forEach(exchange => {
                    requests.push(createRequest(crypto, operation, exchange));
                });

                Promise.all(requests)
                    .then(([latestKraken, latestBinance, latestFTX, latestCrypto]) => {
                        let bestExchange = latestKraken;
                        console.log('Kraken ' + operation + ' ' + crypto + ' at ' + latestKraken.price + '$');
                        console.log('Binance ' + operation + ' ' + crypto + ' at ' + latestBinance.price + '$');
                        console.log('FTX ' + operation + ' ' + crypto + ' at ' + latestFTX.price + '$');
                        console.log('Crypto.com ' + operation + ' ' + crypto + ' at ' + latestCrypto.price + '$');

                        if (operation == 'buy') {
                            if (latestBinance.price < bestExchange.price) {
                                bestExchange = latestBinance;
                            }
                            if (latestFTX.price < bestExchange.price) {
                                bestExchange = latestFTX;
                            }
                            if (latestCrypto.price < bestExchange.price) {
                                bestExchange = latestCrypto;
                            }
                        } else {
                            if (latestBinance.price > bestExchange.price) {
                                bestExchange = latestBinance;
                            }
                            if (latestFTX.price > bestExchange.price) {
                                bestExchange = latestFTX;
                            }
                            if (latestCrypto.price > bestExchange.price) {
                                bestExchange = latestCrypto;
                            }
                        }

                        res.status(200).send(bestExchange);
                    })
                    .catch(e => console.log(e));
                break;
            case 'AVAX':
                var requests = [];
                var exchanges = ['Binance', 'Coinbase', 'FTX', 'Crypto.com'];
                exchanges.forEach(exchange => {
                    requests.push(createRequest(crypto, operation, exchange));
                });

                Promise.all(requests)
                    .then(([latestCoinbase, latestBinance, latestFTX, latestCrypto]) => {
                        let bestExchange = latestBinance;
                        console.log('Coinbase ' + operation + ' ' + crypto + ' at ' + latestCoinbase.price + '$');
                        console.log('Binance ' + operation + ' ' + crypto + ' at ' + latestBinance.price + '$');
                        console.log('FTX ' + operation + ' ' + crypto + ' at ' + latestFTX.price + '$');
                        console.log('Crypto.com ' + operation + ' ' + crypto + ' at ' + latestCrypto.price + '$');

                        if (operation == 'buy') {
                            if (latestCoinbase.price < bestExchange.price) {
                                bestExchange = latestCoinbase;
                            }
                            if (latestFTX.price < bestExchange.price) {
                                bestExchange = latestFTX;
                            }
                            if (latestCrypto.price < bestExchange.price) {
                                bestExchange = latestCrypto;
                            }
                        } else {
                            if (latestCoinbase.price > bestExchange.price) {
                                bestExchange = latestCoinbase;
                            }
                            if (latestFTX.price > bestExchange.price) {
                                bestExchange = latestFTX;
                            }
                            if (latestCrypto.price > bestExchange.price) {
                                bestExchange = latestCrypto;
                            }
                        }

                        res.status(200).send(bestExchange);
                    })
                    .catch(e => console.log(e));
                break;
            case 'LUNA':
                var requests = [];
                var exchanges = ['Binance', 'Crypto.com'];
                exchanges.forEach(exchange => {
                    requests.push(createRequest(crypto, operation, exchange));
                });

                Promise.all(requests)
                    .then(([latestBinance, latestCrypto]) => {
                        let bestExchange = latestBinance;
                        console.log('Binance ' + operation + ' ' + crypto + ' at ' + latestBinance.price + '$');
                        console.log('Crypto.com ' + operation + ' ' + crypto + ' at ' + latestCrypto.price + '$');

                        if (operation == 'buy') {
                            if (latestCrypto.price < bestExchange.price) {
                                bestExchange = latestCrypto;
                            }
                        } else {
                            if (latestCrypto.price > bestExchange.price) {
                                bestExchange = latestCrypto;
                            }
                        }

                        res.status(200).send(bestExchange);
                    })
                    .catch(e => console.log(e));
                break;
            default:
                console.log('Crypto not supported yet!');
        }
    }
});

function createRequest(crypto, operation, exchange) {
    return axios.get(process.env.DATA_ADAPTER_HOST + '/price/crypto/' + crypto + '/latest/operation/' + operation + '/exchange/' + exchange, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
        .then(response => response.data);
}

const TIME_OFFSET = 3660000;
const LATEST = 30 * 60 * 1000;
const THRESHOLD = 0.3;

const Notification = require('./model/Notification');

function analyzePeak(crypto, operation, exchange) {
    var getLatest = axios.get(process.env.DATA_ADAPTER_HOST + '/price/crypto/' + crypto + '/latest/operation/' + operation + '/exchange/' + exchange, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
        .then(response => response.data);
    var date = new Date(Date.now() - LATEST + TIME_OFFSET);
    var getLatestPeriod = axios.get(process.env.DATA_ADAPTER_HOST + '/price/crypto/' + crypto + '/since/' + date.toISOString() + '/operation/' + operation + '/exchange/' + exchange, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
        .then(response => response.data);

    Promise.all([getLatest, getLatestPeriod])
        .then(([latestPrice, latestPeriod]) => {
            if (latestPeriod.length >= 2) {
                let sum = 0;
                for (let i = 0; i < (latestPeriod.length - 1); i++) {
                    sum = sum + latestPeriod[i].price;
                }
                let avg = sum / (latestPeriod.length - 1);

                // console.log(crypto+' on '+exchange+' for '+operation+': latest price = ' + latestPrice.price + ', avg = ' + avg);

                // send notification when high growth
                if (latestPrice.price >= avg + avg * THRESHOLD) {
                    const growth = latestPrice.price / avg * 100;
                    const title = crypto + ' is flying!';
                    const body = crypto + ' is +' + growth + '% from last hour moving average, is it time to sell?';
                    const icon = '';
                    const notification = new Notification(title, body, icon);

                    axios.post(
                        process.env.PROCESS_CENTRIC_HOST + '/exchanges/notification/crypto/' + crypto,
                        notification,
                        { headers: { 'Authorization': process.env.PROCESS_CENTRIC_KEY } }
                    )
                        .catch(e => {
                            console.log(e);
                        });
                }

                // send notification when high loss
                if (latestPrice.price <= avg - avg * THRESHOLD) {
                    const loss = latestPrice.price / avg * 100;
                    const title = crypto + ' is crashing!';
                    const body = crypto + ' is -' + loss + '% from last hour moving average, is it time to buy?';
                    const icon = '';
                    const notification = new Notification(title, body, icon);

                    axios.post(
                        process.env.PROCESS_CENTRIC_HOST + '/exchanges/notification/crypto/' + crypto,
                        notification,
                        { headers: { 'Authorization': process.env.PROCESS_CENTRIC_KEY } }
                    )
                    .catch(e => {
                        console.log(e);
                    });
                }
            }
        })
        .catch(e => {
            console.log(e);
        });
}

function analyzeAllPeaks() {
    CRYPTOS.forEach(crypto => {
        switch (crypto) {
            case 'BNB':
                OPERATIONS.forEach(operation => {
                    analyzePeak(crypto, operation, 'Binance');
                    analyzePeak(crypto, operation, 'FTX');
                });
                break;
            case 'XRP':
                OPERATIONS.forEach(operation => {
                    analyzePeak(crypto, operation, 'Binance');
                    analyzePeak(crypto, operation, 'FTX');
                    analyzePeak(crypto, operation, 'Crypto.com');
                    analyzePeak(crypto, operation, 'Kraken');
                });
                break;
            case 'AVAX':
                OPERATIONS.forEach(operation => {
                    analyzePeak(crypto, operation, 'Coinbase');
                    analyzePeak(crypto, operation, 'Binance');
                    analyzePeak(crypto, operation, 'FTX');
                    analyzePeak(crypto, operation, 'Crypto.com');
                });
                break;
            case 'LUNA':
                OPERATIONS.forEach(operation => {
                    analyzePeak(crypto, operation, 'Binance');
                    analyzePeak(crypto, operation, 'Crypto.com');
                });
                break;
            default:
                OPERATIONS.forEach(operation => {
                    EXCHANGES.forEach(exchange => {
                        analyzePeak(crypto, operation, exchange);
                    });
                });
                break;
        }
    });
}

const TIMER = process.env.TIMER || 5 * 60 * 1000;

setInterval(analyzeAllPeaks, TIMER);

app.listen(PORT, () => {
    console.log('Exchanges business logic listening on port ' + PORT);
});