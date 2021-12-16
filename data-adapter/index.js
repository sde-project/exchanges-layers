require('dotenv').config();

const express = require('express');
const app = express();

const PORT = process.env.PORT || 2800;

const mongoose = require('mongoose');
const Price = require('./model/Price');

const EXCHANGES = ['Kraken', 'Binance', 'Coinbase', 'FTX', 'Crypto.com'];
const CRYPTOS = ['BTC', 'ETH', 'BNB', 'SOL', 'DOGE', 'XRP', 'DOT', 'AVAX', 'LTC', 'LUNA'];
const OPERATIONS = ['buy', 'sell'];

mongoose.connect(process.env.DB_URL,
    () => {
        console.log('Connected to mongodb');
    },
    e => console.log(e)
);

app.use((req, res, next) => {
    if (req.header('authorization') !== process.env.DB_ADAPTER_KEY) {
        return res.status(401).send({ statusCode: 401, message: "unauthorized" });
    } else {
        next();
    }
});

app.use(express.json());

app.post('/price', (req, res) => {
    if (isValidPrice(req.body)) {
        var price = new Price(req.body);
        price.save()
            .then(price => {
                res.status(200).send({ statusCode: 200, message: "price saved succesfully" });
            })
            .catch(err => {
                console.log(err);
                res.status(500).send({ statusCode: 500, message: "error in saving price" });
            })
    } else {
        res.status(400).send({ statusCode: 400, message: "price not valid" });
    }
});

function isValidPrice(price) {
    res = true;
    if (price.exchange == undefined | price.exchange == null | !EXCHANGES.includes(price.exchange)) {
        res = false;
    }
    if (price.crypto == undefined | price.crypto == null | !CRYPTOS.includes(price.crypto)) {
        res = false;
    }
    if (price.operation == undefined | price.operation == null | !OPERATIONS.includes(price.operation)) {
        res = false;
    }
    return res;
}

// TODO: define method for getting prices
app.get('/all');

app.get('/price/exchange/:exchange');

app.get('/price/crypto/:crypto');

app.get('/price/date/:date');

app.listen(PORT, () => {
    console.log('Data adapter layer listening on port ' + PORT);
});