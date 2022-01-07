require('dotenv').config();

const express = require('express');
const app = express();

const PORT = process.env.PORT || 2901;

const mongoose = require('mongoose');
const Price = require('./model/Price');

const EXCHANGES = ['Kraken', 'Binance', 'Coinbase', 'FTX', 'Crypto.com'];
const CRYPTOS = ['BTC', 'ETH', 'BNB', 'SOL', 'DOGE', 'XRP', 'DOT', 'AVAX', 'LTC', 'LUNA'];
const OPERATIONS = ['buy', 'sell'];

// not sure about this
const TIME_OFFSET = 3660000;

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

mongoose.connect(process.env.DB_URL,
    () => {
        console.log('Connected to mongodb on '+process.env.DB_URL);
    },
    e => console.log(e)
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res, next) => {
    if (req.header('Authorization') !== process.env.DB_ADAPTER_KEY) {
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
                res.status(201).send({ statusCode: 201, message: "price saved succesfully" });
            })
            .catch(err => {
                console.log('error in saving price to db');
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

    if (!res) {
        console.log('received invalid price:');
        console.log(price);
    }

    return res;
}

// TODO: define what methods to access prices

// BUG: sorting not working properly with too much data???
app.get('/price/all', (req, res) => {
    Price.find({}).sort('date').exec((err, prices) => {
        if (err) {
            console.log('db error:');
            console.log(err);
            res.status(500).send({ statusCode: 500, message: 'DB error' });
        } else {
            res.status(200).send(prices);
        }
    });
});

app.get('/price/crypto/:crypto/since/:date/operation/:operation/exchange/:exchange', (req, res) => {
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
    } else if (isNaN(date)){
        res.status(400).send({ statusCode: 400, message: 'invalid date' });
    } else {
        Price.find({ 'exchange': exchange, 'crypto': crypto, 'operation': operation, 'date': {$gte: date, $lt: Date.now()+TIME_OFFSET } }).sort('date').exec((err, prices) => {
            if (err) {
                console.log('db error:');
                console.log(err);
                res.status(500).send({ statusCode: 500, message: 'DB error' });
            } else {
                res.status(200).send(prices);
            }
        });
    }
});

app.get('/price/crypto/:crypto/from/:from/to/:to/operation/:operation/exchange/:exchange', (req, res) => {
    const crypto = req.params.crypto;
    const exchange = req.params.exchange;
    const operation = req.params.operation;
    const from = Date.parse(req.params.from);
    const to = Date.parse(req.params.to);
    if (!CRYPTOS.includes(crypto)) {
        res.status(404).send({ statusCode: 404, message: 'crypto not found' });
    } else if (!EXCHANGES.includes(exchange)) {
        res.status(404).send({ statusCode: 404, message: 'exchange not found' });
    } else if (!OPERATIONS.includes(operation)) {
        res.status(404).send({ statusCode: 404, message: 'operation not found' });
    } else if (isNaN(from) || isNaN(to)){
        res.status(400).send({ statusCode: 400, message: 'invalid date(s)' });
    } else {
        Price.find({ 'exchange': exchange, 'crypto': crypto, 'operation': operation, 'date': {$gte: from, $lt: to } }).sort('date').exec((err, prices) => {
            if (err) {
                console.log('db error:');
                console.log(err);
                res.status(500).send({ statusCode: 500, message: 'DB error' });
            } else {
                res.status(200).send(prices);
            }
        });
    }
});

app.get('/price/crypto/:crypto/latest/operation/:operation/exchange/:exchange/', (req, res) => {
    const crypto = req.params.crypto;
    const exchange = req.params.exchange;
    const operation = req.params.operation;
    if (!CRYPTOS.includes(crypto)) {
        res.status(404).send({ statusCode: 404, message: 'crypto not found' });
    } else if (!EXCHANGES.includes(exchange)) {
        res.status(404).send({ statusCode: 404, message: 'exchange not found' });
    } else if (!OPERATIONS.includes(operation)) {
        res.status(404).send({ statusCode: 404, message: 'operation not found' });
    } else {
        Price.findOne({ 'exchange': exchange, 'crypto': crypto, 'operation': operation }).sort('-date').exec((err, price) => {
            if (err) {
                console.log('db error:');
                console.log(err);
                res.status(500).send({ statusCode: 500, message: 'DB error' });
            } else {
                res.status(200).send(price);
            }
        });
    }
});

app.get('/price/since/:date', (req, res) => {
    const date = Date.parse(req.params.date);
    if (!isNaN(date)) {
        Price.find({ 'date': {$gte: date, $lt: Date.now()+TIME_OFFSET } }).sort('date').exec((err, prices) => {
            if (err) {
                console.log('db error:');
                console.log(err);
                res.status(500).send({ statusCode: 500, message: 'DB error' });
            } else {
                res.status(200).send(prices);
            }
        });
    } else {
        res.status(400).send({ statusCode: 400, message: 'invalid date' });
    } 
});

app.get('/price/from/:from/to/:to', (req, res) => {
    const from = Date.parse(req.params.from);
    const to = Date.parse(req.params.to);
    if (!isNaN(from) && !isNaN(to)) {
        Price.find({ 'date': {$gte: from, $lt: to } }).sort('date').exec((err, prices) => {
            if (err) {
                console.log('db error:');
                console.log(err);
                res.status(500).send({ statusCode: 500, message: 'DB error' });
            } else {
                res.status(200).send(prices);
            }
        });
    } else {
        res.status(400).send({ statusCode: 400, message: 'invalid date(s)' });
    } 
});

app.listen(PORT, () => {
    console.log('Data adapter layer listening on port ' + PORT);
});
