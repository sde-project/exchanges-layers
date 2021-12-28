require('dotenv').config();

const express = require('express');
const app = express();

const PORT = process.env.PORT || 2900;

const axios = require('axios');

const Price = require('./model/Price');

const EXCHANGES = ['Kraken', 'Binance', 'Coinbase', 'FTX', 'Crypto.com'];
const CRYPTOS = ['BTC', 'ETH', 'BNB', 'SOL', 'DOGE', 'XRP', 'DOT', 'AVAX', 'LTC', 'LUNA'];
const OPERATIONS = ['buy', 'sell'];

app.use(express.json());

/*
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
*/

app.post('/notification/crypto/:crypto', (req, res) => {
    if (req.header('Authorization') !== process.env.PROCESS_CENTRIC_KEY) {
        return res.status(401).send({ statusCode: 401, message: "unauthorized" });
    } else {
        const notification = req.body;
        const crypto = req.params.crypto;
        axios
        .post(
            process.env.USERS_BUSINESS_LOGIC_HOST+'/devices/notifications/crypto/'+crypto,
             notification)
        .catch(e => console.log(e));
    }
});

app.get('/exchanges/best', (req, res) => {

});

app.get('/prices/since/:date', (req, res) => {

});

app.listen(PORT, () => {
    console.log('Exchanges process centric listening on port ' + PORT);
});