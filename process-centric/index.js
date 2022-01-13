require('dotenv').config();

const express = require('express');
const app = express();

const PORT = process.env.PORT || 8000;

const axios = require('axios');

const Price = require('./model/Price');
const { response } = require('express');

const EXCHANGES = ['Kraken', 'Binance', 'Coinbase', 'FTX', 'Crypto.com'];
const CRYPTOS = ['BTC', 'ETH', 'BNB', 'SOL', 'DOGE', 'XRP', 'DOT', 'AVAX', 'LTC', 'LUNA'];
const OPERATIONS = ['buy', 'sell'];

app.use(express.json());


const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/exchanges/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.post('/exchanges/notification/crypto/:crypto', (req, res) => {
    if (req.header('Authorization') != process.env.PROCESS_CENTRIC_KEY) {
        res.status(401).send({ statusCode: 401, message: "unauthorized" });
    } else {
        const notification = req.body;
        const crypto = req.params.crypto;
        console.log(`posting notification: ${notification.notification.title}, ${notification.notification.body}`);
        axios.post(process.env.USERS_BUSINESS_LOGIC_HOST + '/devices/notifications/crypto/' + crypto, notification, { headers: { 'api-key': process.env.USERS_BUSINESS_LOGIC_KEY } })
            .then(response => res.status(200).send({ statusCode: 200, message: 'notification sent' }))
            .catch(e => {
                console.log(e);
                res.status(500).send({ statusCode: 500, message: 'server error' });
            });
    }
});

app.get('/exchanges/best/all', (req, res) => {
    console.log('computing all best exchanges');
    var bestExchanges = {};
    var requests = [];
    CRYPTOS.forEach(crypto => {
        requests.push(axios.get(process.env.EXCHANGES_BUSINESS_LOGIC_HOST + '/exchange/best/operation/buy/crypto/' + crypto, { headers: { 'Authorization': process.env.EXCHANGES_BUSINESS_LOGIC_KEY } })
            .then(response => response.data));
        requests.push(axios.get(process.env.EXCHANGES_BUSINESS_LOGIC_HOST + '/exchange/best/operation/sell/crypto/' + crypto, { headers: { 'Authorization': process.env.EXCHANGES_BUSINESS_LOGIC_KEY } })
            .then(response => response.data));
    });
    Promise.all(requests)
        .then(responses => {
            var allPrices = [];
            responses.forEach(resp => {
                allPrices.push(resp);
            });
            CRYPTOS.forEach(crypto => {
                var pricesCrypto = allPrices.filter(price => price.crypto == crypto);
                bestExchanges[crypto] = {};
                pricesCrypto.forEach(price => {
                    if (price.operation == 'buy') {
                        bestExchanges[crypto]['buy'] = price;
                    } else {
                        bestExchanges[crypto]['sell'] = price;
                    }
                });
            });
            res.status(200).send(bestExchanges);
        })
        .catch(err => {
            console.log('error computing all best exchanges');
            console.log(err);
            res.status(500).send({ statusCode: 500, message: 'server error' });
        });
});

app.get('/exchanges/best/:operation', (req, res) => {
    const operation = req.params.operation;
    if (!OPERATIONS.includes(operation)) {
        res.status(404).send({ statusCode: 404, message: 'operation not found' });
    } else {
        console.log('computing best exchanges ('+operation+') for user');
        axios.get(process.env.USERS_BUSINESS_LOGIC_HOST + '/users/me', { headers: { 'Authorization': req.headers.authorization, 'api-key': process.env.USERS_BUSINESS_LOGIC_KEY } })
            .then(response => response.data)
            .then(user => {
                var cryptos = user.cryptos;
                var requests = [];
                cryptos.forEach(crypto => {
                    requests.push(axios.get(process.env.EXCHANGES_BUSINESS_LOGIC_HOST + '/exchange/best/operation/' + operation + '/crypto/' + crypto, { headers: { 'Authorization': process.env.EXCHANGES_BUSINESS_LOGIC_KEY } }).then(response => response.data));
                });
                Promise.all(requests)
                    .then(responses => {
                        var bestExchanges = [];
                        responses.forEach(response => {
                            bestExchanges.push(response);
                        });
                        res.status(200).send(bestExchanges);
                    })
                    .catch(e => {
                        console.log(e);
                        res.status(500).send({ statusCode: 500, message: "server error" });
                    });
            })
            .catch(e => {
                console.log(e);
                res.status(500).send({ statusCode: 500, message: 'server error' })
            });
    }
});

app.get('/exchanges/price/since/:date', (req, res) => {
    var dateVal = new Date(Date.parse(req.params.date));
    var date = dateVal.toISOString();
    if (isNaN(dateVal)) {
        res.status(400).send({ statusCode: 400, message: 'invalid date' });
    } else {
        console.log('computing prices since '+date+' for user');
        axios.get(process.env.USERS_BUSINESS_LOGIC_HOST + '/users/me', { headers: { 'Authorization': req.headers.authorization, 'api-key': process.env.USERS_BUSINESS_LOGIC_KEY } })
            .then(response => response.data)
            .then(user => {
                var cryptos = user.cryptos;
                var requests = [];
                OPERATIONS.forEach(operation => {
                    cryptos.forEach(crypto => {
                        switch (crypto) {
                            case 'BNB':
                                requests.push(
                                    axios.get(process.env.EXCHANGES_DATA_ADAPTER_HOST + '/price/crypto/' + crypto + '/since/' + date + '/operation/' + operation + '/exchange/Binance', { headers: { 'Authorization': process.env.EXCHANGES_DATA_ADAPTER_KEY } })
                                        .then(response => response.data)
                                );
                                requests.push(
                                    axios.get(process.env.EXCHANGES_DATA_ADAPTER_HOST + '/price/crypto/' + crypto + '/since/' + date + '/operation/' + operation + '/exchange/FTX', { headers: { 'Authorization': process.env.EXCHANGES_DATA_ADAPTER_KEY } })
                                        .then(response => response.data)
                                );
                                break;
                            case 'XRP':
                                requests.push(
                                    axios.get(process.env.EXCHANGES_DATA_ADAPTER_HOST + '/price/crypto/' + crypto + '/since/' + date + '/operation/' + operation + '/exchange/Kraken', { headers: { 'Authorization': process.env.EXCHANGES_DATA_ADAPTER_KEY } })
                                        .then(response => response.data)
                                );
                                requests.push(
                                    axios.get(process.env.EXCHANGES_DATA_ADAPTER_HOST + '/price/crypto/' + crypto + '/since/' + date + '/operation/' + operation + '/exchange/FTX', { headers: { 'Authorization': process.env.EXCHANGES_DATA_ADAPTER_KEY } })
                                        .then(response => response.data)
                                );
                                requests.push(
                                    axios.get(process.env.EXCHANGES_DATA_ADAPTER_HOST + '/price/crypto/' + crypto + '/since/' + date + '/operation/' + operation + '/exchange/Crypto.com', { headers: { 'Authorization': process.env.EXCHANGES_DATA_ADAPTER_KEY } })
                                        .then(response => response.data)
                                );
                                requests.push(
                                    axios.get(process.env.EXCHANGES_DATA_ADAPTER_HOST + '/price/crypto/' + crypto + '/since/' + date + '/operation/' + operation + '/exchange/Binance', { headers: { 'Authorization': process.env.EXCHANGES_DATA_ADAPTER_KEY } })
                                        .then(response => response.data)
                                );
                                break;
                            case 'AVAX':
                                requests.push(
                                    axios.get(process.env.EXCHANGES_DATA_ADAPTER_HOST + '/price/crypto/' + crypto + '/since/' + date + '/operation/' + operation + '/exchange/Coinbase', { headers: { 'Authorization': process.env.EXCHANGES_DATA_ADAPTER_KEY } })
                                        .then(response => response.data)
                                );
                                requests.push(
                                    axios.get(process.env.EXCHANGES_DATA_ADAPTER_HOST + '/price/crypto/' + crypto + '/since/' + date + '/operation/' + operation + '/exchange/FTX', { headers: { 'Authorization': process.env.EXCHANGES_DATA_ADAPTER_KEY } })
                                        .then(response => response.data)
                                );
                                requests.push(
                                    axios.get(process.env.EXCHANGES_DATA_ADAPTER_HOST + '/price/crypto/' + crypto + '/since/' + date + '/operation/' + operation + '/exchange/Crypto.com', { headers: { 'Authorization': process.env.EXCHANGES_DATA_ADAPTER_KEY } })
                                        .then(response => response.data)
                                );
                                requests.push(
                                    axios.get(process.env.EXCHANGES_DATA_ADAPTER_HOST + '/price/crypto/' + crypto + '/since/' + date + '/operation/' + operation + '/exchange/Binance', { headers: { 'Authorization': process.env.EXCHANGES_DATA_ADAPTER_KEY } })
                                        .then(response => response.data)
                                );
                                break;
                            case 'LUNA':
                                requests.push(
                                    axios.get(process.env.EXCHANGES_DATA_ADAPTER_HOST + '/price/crypto/' + crypto + '/since/' + date + '/operation/' + operation + '/exchange/Crypto.com', { headers: { 'Authorization': process.env.EXCHANGES_DATA_ADAPTER_KEY } })
                                        .then(response => response.data)
                                );
                                requests.push(
                                    axios.get(process.env.EXCHANGES_DATA_ADAPTER_HOST + '/price/crypto/' + crypto + '/since/' + date + '/operation/' + operation + '/exchange/Binance', { headers: { 'Authorization': process.env.EXCHANGES_DATA_ADAPTER_KEY } })
                                        .then(response => response.data)
                                );
                                break;
                            default:
                                requests.push(
                                    axios.get(process.env.EXCHANGES_DATA_ADAPTER_HOST + '/price/crypto/' + crypto + '/since/' + date + '/operation/' + operation + '/exchange/Kraken', { headers: { 'Authorization': process.env.EXCHANGES_DATA_ADAPTER_KEY } })
                                        .then(response => response.data)
                                );
                                requests.push(
                                    axios.get(process.env.EXCHANGES_DATA_ADAPTER_HOST + '/price/crypto/' + crypto + '/since/' + date + '/operation/' + operation + '/exchange/FTX', { headers: { 'Authorization': process.env.EXCHANGES_DATA_ADAPTER_KEY } })
                                        .then(response => response.data)
                                );
                                requests.push(
                                    axios.get(process.env.EXCHANGES_DATA_ADAPTER_HOST + '/price/crypto/' + crypto + '/since/' + date + '/operation/' + operation + '/exchange/Crypto.com', { headers: { 'Authorization': process.env.EXCHANGES_DATA_ADAPTER_KEY } })
                                        .then(response => response.data)
                                );
                                requests.push(
                                    axios.get(process.env.EXCHANGES_DATA_ADAPTER_HOST + '/price/crypto/' + crypto + '/since/' + date + '/operation/' + operation + '/exchange/Binance', { headers: { 'Authorization': process.env.EXCHANGES_DATA_ADAPTER_KEY } })
                                        .then(response => response.data)
                                );
                                requests.push(
                                    axios.get(process.env.EXCHANGES_DATA_ADAPTER_HOST + '/price/crypto/' + crypto + '/since/' + date + '/operation/' + operation + '/exchange/Coinbase', { headers: { 'Authorization': process.env.EXCHANGES_DATA_ADAPTER_KEY } })
                                        .then(response => response.data)
                                );
                                break;
                        }

                    });
                });
                Promise.all(requests)
                    .then(responses => {
                        var allPrices = [];
                        responses.forEach(response => {
                            allPrices = allPrices.concat(response);
                        });
                        var userPrices = [];
                        cryptos.forEach(crypto => {
                            var userPrice = {};
                            userPrice['crypto'] = crypto;
                            userPrice['prices'] = {}
                            userPrice['prices']['buy'] = allPrices.filter(price => price.crypto == crypto && price.operation == 'buy');
                            userPrice['prices']['sell'] = allPrices.filter(price => price.crypto == crypto && price.operation == 'sell');
                            userPrices.push(userPrice);
                        });
                        res.status(200).send(userPrices);
                    })
                    .catch(e => {
                        console.log(e);
                        res.status(500).send({ statusCode: 500, message: 'server error' });
                    });
            })
            .catch(e => {
                console.log(e);
                res.status(500).send({ statusCode: 500, message: 'server error' });
            });
    }
});

app.get('/exchanges/price/from/:from/to/:to', (req, res) => {
    var fromVal = new Date(Date.parse(req.params.from));
    var from = fromVal.toISOString();
    var toVal = new Date(Date.parse(req.params.to));
    var to = toVal.toISOString();
    if (isNaN(fromVal) || isNaN(toVal)) {
        res.status(400).send({ statusCode: 400, message: 'invalid date(s)' });
    } else {
        console.log('computing prices from '+from+' to '+ to+' for user');
        axios.get(process.env.USERS_BUSINESS_LOGIC_HOST + '/users/me', { headers: { 'Authorization': req.headers.authorization, 'api-key': process.env.USERS_BUSINESS_LOGIC_KEY } })
            .then(response => response.data)
            .then(user => {
                var cryptos = user.cryptos;
                var requests = [];
                OPERATIONS.forEach(operation => {
                    cryptos.forEach(crypto => {
                        switch (crypto) {
                            case 'BNB':
                                requests.push(
                                    axios.get(process.env.EXCHANGES_DATA_ADAPTER_HOST + '/price/crypto/' + crypto + '/from/' + from + '/to/' + to + '/operation/' + operation + '/exchange/Binance', { headers: { 'Authorization': process.env.EXCHANGES_DATA_ADAPTER_KEY } })
                                        .then(response => response.data)
                                );
                                requests.push(
                                    axios.get(process.env.EXCHANGES_DATA_ADAPTER_HOST + '/price/crypto/' + crypto + '/from/' + from + '/to/' + to + '/operation/' + operation + '/exchange/FTX', { headers: { 'Authorization': process.env.EXCHANGES_DATA_ADAPTER_KEY } })
                                        .then(response => response.data)
                                );
                                break;
                            case 'XRP':
                                requests.push(
                                    axios.get(process.env.EXCHANGES_DATA_ADAPTER_HOST + '/price/crypto/' + crypto + '/from/' + from + '/to/' + to + '/operation/' + operation + '/exchange/Kraken', { headers: { 'Authorization': process.env.EXCHANGES_DATA_ADAPTER_KEY } })
                                        .then(response => response.data)
                                );
                                requests.push(
                                    axios.get(process.env.EXCHANGES_DATA_ADAPTER_HOST + '/price/crypto/' + crypto + '/from/' + from + '/to/' + to + '/operation/' + operation + '/exchange/FTX', { headers: { 'Authorization': process.env.EXCHANGES_DATA_ADAPTER_KEY } })
                                        .then(response => response.data)
                                );
                                requests.push(
                                    axios.get(process.env.EXCHANGES_DATA_ADAPTER_HOST + '/price/crypto/' + crypto + '/from/' + from + '/to/' + to + '/operation/' + operation + '/exchange/Crypto.com', { headers: { 'Authorization': process.env.EXCHANGES_DATA_ADAPTER_KEY } })
                                        .then(response => response.data)
                                );
                                requests.push(
                                    axios.get(process.env.EXCHANGES_DATA_ADAPTER_HOST + '/price/crypto/' + crypto + '/from/' + from + '/to/' + to + '/operation/' + operation + '/exchange/Binance', { headers: { 'Authorization': process.env.EXCHANGES_DATA_ADAPTER_KEY } })
                                        .then(response => response.data)
                                );
                                break;
                            case 'AVAX':
                                requests.push(
                                    axios.get(process.env.EXCHANGES_DATA_ADAPTER_HOST + '/price/crypto/' + crypto + '/from/' + from + '/to/' + to + '/operation/' + operation + '/exchange/Coinbase', { headers: { 'Authorization': process.env.EXCHANGES_DATA_ADAPTER_KEY } })
                                        .then(response => response.data)
                                );
                                requests.push(
                                    axios.get(process.env.EXCHANGES_DATA_ADAPTER_HOST + '/price/crypto/' + crypto + '/from/' + from + '/to/' + to + '/operation/' + operation + '/exchange/FTX', { headers: { 'Authorization': process.env.EXCHANGES_DATA_ADAPTER_KEY } })
                                        .then(response => response.data)
                                );
                                requests.push(
                                    axios.get(process.env.EXCHANGES_DATA_ADAPTER_HOST + '/price/crypto/' + crypto + '/from/' + from + '/to/' + to + '/operation/' + operation + '/exchange/Crypto.com', { headers: { 'Authorization': process.env.EXCHANGES_DATA_ADAPTER_KEY } })
                                        .then(response => response.data)
                                );
                                requests.push(
                                    axios.get(process.env.EXCHANGES_DATA_ADAPTER_HOST + '/price/crypto/' + crypto + '/from/' + from + '/to/' + to + '/operation/' + operation + '/exchange/Binance', { headers: { 'Authorization': process.env.EXCHANGES_DATA_ADAPTER_KEY } })
                                        .then(response => response.data)
                                );
                                break;
                            case 'LUNA':
                                requests.push(
                                    axios.get(process.env.EXCHANGES_DATA_ADAPTER_HOST + '/price/crypto/' + crypto + '/from/' + from + '/to/' + to + '/operation/' + operation + '/exchange/Crypto.com', { headers: { 'Authorization': process.env.EXCHANGES_DATA_ADAPTER_KEY } })
                                        .then(response => response.data)
                                );
                                requests.push(
                                    axios.get(process.env.EXCHANGES_DATA_ADAPTER_HOST + '/price/crypto/' + crypto + '/from/' + from + '/to/' + to + '/operation/' + operation + '/exchange/Binance', { headers: { 'Authorization': process.env.EXCHANGES_DATA_ADAPTER_KEY } })
                                        .then(response => response.data)
                                );
                                break;
                            default:
                                requests.push(
                                    axios.get(process.env.EXCHANGES_DATA_ADAPTER_HOST + '/price/crypto/' + crypto + '/from/' + from + '/to/' + to + '/operation/' + operation + '/exchange/Kraken', { headers: { 'Authorization': process.env.EXCHANGES_DATA_ADAPTER_KEY } })
                                        .then(response => response.data)
                                );
                                requests.push(
                                    axios.get(process.env.EXCHANGES_DATA_ADAPTER_HOST + '/price/crypto/' + crypto + '/from/' + from + '/to/' + to + '/operation/' + operation + '/exchange/FTX', { headers: { 'Authorization': process.env.EXCHANGES_DATA_ADAPTER_KEY } })
                                        .then(response => response.data)
                                );
                                requests.push(
                                    axios.get(process.env.EXCHANGES_DATA_ADAPTER_HOST + '/price/crypto/' + crypto + '/from/' + from + '/to/' + to + '/operation/' + operation + '/exchange/Crypto.com', { headers: { 'Authorization': process.env.EXCHANGES_DATA_ADAPTER_KEY } })
                                        .then(response => response.data)
                                );
                                requests.push(
                                    axios.get(process.env.EXCHANGES_DATA_ADAPTER_HOST + '/price/crypto/' + crypto + '/from/' + from + '/to/' + to + '/operation/' + operation + '/exchange/Binance', { headers: { 'Authorization': process.env.EXCHANGES_DATA_ADAPTER_KEY } })
                                        .then(response => response.data)
                                );
                                requests.push(
                                    axios.get(process.env.EXCHANGES_DATA_ADAPTER_HOST + '/price/crypto/' + crypto + '/from/' + from + '/to/' + to + '/operation/' + operation + '/exchange/Coinbase', { headers: { 'Authorization': process.env.EXCHANGES_DATA_ADAPTER_KEY } })
                                        .then(response => response.data)
                                );
                                break;
                        }

                    });
                });
                Promise.all(requests)
                    .then(responses => {
                        var allPrices = [];
                        responses.forEach(response => {
                            allPrices = allPrices.concat(response);
                        });
                        var userPrices = [];
                        cryptos.forEach(crypto => {
                            var userPrice = {};
                            userPrice['crypto'] = crypto;
                            userPrice['prices'] = {}
                            userPrice['prices']['buy'] = allPrices.filter(price => price.crypto == crypto && price.operation == 'buy');
                            userPrice['prices']['sell'] = allPrices.filter(price => price.crypto == crypto && price.operation == 'sell');
                            userPrices.push(userPrice);
                        });
                        res.status(200).send(userPrices);
                    })
                    .catch(e => {
                        console.log(e);
                        res.status(500).send({ statusCode: 500, message: 'server error' });
                    });
            })
            .catch(e => {
                console.log(e);
                res.status(500).send({ statusCode: 500, message: 'server error' });
            });

    }
});

app.listen(PORT, () => {
    console.log('Exchanges process centric listening on port ' + PORT);
});