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
                    });
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
                    });
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
                    });
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
                    });
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
                    });
                break;
            default:
                console.log('Crypto not supported yet!');
        }
    }
});

function createRequest (crypto, operation, exchange) {
    return axios.get(process.env.DATA_ADAPTER_HOST + '/price/crypto/' + crypto + '/latest/operation/' + operation + '/exchange/' + exchange, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
        .then(response => response.data);
}

/*
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

const fs = require('fs');

app.get('/exchange/dataset/crypto/:crypto/since/:date/operation/:operation/exchange/:exchange', (req, res) => {
    const crypto = req.params.crypto;
    const exchange = req.params.exchange;
    const operation = req.params.operation;
    const date = Date.parse(req.params.date);
    if (!CRYPTOS.includes(crypto)) {
        res.status(404).send({ statusCode: 404, message: 'crypto not found' });
    } else if (!EXCHANGES.includes(exchange)) {
        res.status(404).send({ statusCode: 404, message: 'exchange not found' });
    } else if (!OPERATIONS.includes(operation)) {
        res.status(404).send({ statusCode: 404, message: 'operation not found' });
    } else if (isNaN(date)) {
        res.status(400).send({ statusCode: 400, message: 'invalid date' });
    } else {
        axios.get(process.env.DATA_ADAPTER_HOST + '/price/crypto/' + crypto + '/since/' + req.params.date + '/operation/' + operation + '/exchange/' + exchange, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
            .then(prices => prices.data)
            .then(prices => {
                var pricesValues = [];
                var datesLabels = [];
                prices.forEach(price => {
                    pricesValues.push(Number(price['price']));
                    let date = new Date(Date.parse(price['date']));
                    datesLabels.push(date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + (date.getHours() - 1) + ':' + date.getMinutes() + ':' + date.getSeconds());
                });
                var color;
                switch (exchange) {
                    case 'Kraken':
                        color = 'purple';
                        break;
                    case 'Binance':
                        color = 'yellow';
                        break;
                    case 'FTX':
                        color = 'cyan';
                        break;
                    case 'Coinbase':
                        color = 'blue';
                        break;
                    case 'Crypto.com':
                        color = 'navy';
                        break;
                    default:
                        color = 'red';
                        break;
                }
                const dataset = {
                    label: 'Prices in $ for ' + operation + 'ing ' + crypto + ' on ' + exchange,
                    data: pricesValues,
                    borderColor: color,
                }
                res.status(200).send({ statusCode: 200, dataset: dataset, dates: datesLabels });
            });
    }
});

const width = 1600;
const height = 900;
const backgroundColor = 'white';
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColor });
function createPlot(configuration) {
    const image = chartJSNodeCanvas.renderToBuffer(configuration, 'image/png');
    fs.writeFile('chart.png', image);
}

const path = require('path');
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/prova.html'));
});
*/

app.listen(PORT, () => {
    console.log('Exchanges business logic listening on port ' + PORT);
})