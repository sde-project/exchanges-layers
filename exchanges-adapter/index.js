require('dotenv').config();

const express = require('express');
const app = express();

const PORT = process.env.PORT || 2800;

const axios = require('axios');

const Price = require('./model/Price');
const RequestManager = require('./model/RequestManager');
const request = new RequestManager();

// List of cryptos (symbols)
const CRYPTOS = ['BTC', 'ETH', 'BNB', 'SOL', 'DOGE', 'XRP', 'DOT', 'AVAX', 'LTC', 'LUNA'];

function getBuyPrices(crypto) {
    switch (crypto) {
        case 'BTC':
        case 'ETH':
        case 'SOL':
        case 'LTC':
        case 'DOGE':
        case 'DOT':
            var getPriceFromKraken = request.buyOnKraken(crypto);
            var getPriceFromBinance = request.buyOnBinance(crypto);
            var getPriceFromCoinbase = request.buyOnCoinbase(crypto);
            var getPriceFromFtx = request.buyOnFtx(crypto);
            var getPriceFromCrypto = request.buyOnCrypto(crypto);

            Promise.all([getPriceFromKraken, getPriceFromBinance, getPriceFromCoinbase, getPriceFromFtx, getPriceFromCrypto])
                .then(([krakenPrice, binancePrice, coinbasePrice, ftxPrice, cryptoPrice]) => {
                    //console.log('-> got buy price on kraken for ' + crypto + ' at ' + krakenPrice.price + '$');
                    //console.log('-> got buy price on binance for ' + crypto + ' at ' + binancePrice.price + '$');
                    //console.log('-> got buy price on coinbase for ' + crypto + ' at ' + coinbasePrice.price + '$');
                    //console.log('-> got buy price on ftx for ' + crypto + ' at ' + ftxPrice.price + '$');
                    //console.log('-> got buy price on crypto for ' + crypto + ' at ' + cryptoPrice.price + '$');
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', krakenPrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log(e));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', binancePrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log(e));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', coinbasePrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log(e));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', ftxPrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log(e));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', cryptoPrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log(e));
                });
            break;
        case 'BNB':
            var getPriceFromBinance = request.buyOnBinance(crypto);
            var getPriceFromFtx = request.buyOnFtx(crypto);

            Promise.all([getPriceFromBinance, getPriceFromFtx])
                .then(([binancePrice, ftxPrice]) => {
                    //console.log('-> got buy price on binance for ' + crypto + ' at ' + binancePrice.price + '$');
                    //console.log('-> got buy price on ftx for ' + crypto + ' at ' + ftxPrice.price + '$');
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', binancePrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log(e));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', ftxPrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log(e));
                });
            break;
        case 'XRP':
            var getPriceFromKraken = request.buyOnKraken(crypto);
            var getPriceFromBinance = request.buyOnBinance(crypto);
            var getPriceFromFtx = request.buyOnFtx(crypto);
            var getPriceFromCrypto = request.buyOnCrypto(crypto);

            Promise.all([getPriceFromKraken, getPriceFromBinance, getPriceFromFtx, getPriceFromCrypto])
                .then(([krakenPrice, binancePrice, ftxPrice, cryptoPrice]) => {
                    //console.log('-> got buy price on kraken for ' + crypto + ' at ' + krakenPrice.price + '$');
                    //console.log('-> got buy price on binance for ' + crypto + ' at ' + binancePrice.price + '$');
                    //console.log('-> got buy price on ftx for ' + crypto + ' at ' + ftxPrice.price + '$');
                    //console.log('-> got buy price on crypto for ' + crypto + ' at ' + cryptoPrice.price + '$');
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', krakenPrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log(e));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', binancePrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log(e));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', ftxPrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log(e));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', cryptoPrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log(e));
                });
            break;
        case 'AVAX':
            var getPriceFromBinance = request.buyOnBinance(crypto);
            var getPriceFromCoinbase = request.buyOnCoinbase(crypto);
            var getPriceFromFtx = request.buyOnFtx(crypto);
            var getPriceFromCrypto = request.buyOnCrypto(crypto);

            Promise.all([getPriceFromBinance, getPriceFromCoinbase, getPriceFromFtx, getPriceFromCrypto])
                .then(([binancePrice, coinbasePrice, ftxPrice, cryptoPrice]) => {
                    //console.log('-> got buy price on binance for ' + crypto + ' at ' + binancePrice.price + '$');
                    //console.log('-> got buy price on coinbase for ' + crypto + ' at ' + coinbasePrice.price + '$');
                    //console.log('-> got buy price on ftx for ' + crypto + ' at ' + ftxPrice.price + '$');
                    //console.log('-> got buy price on crypto for ' + crypto + ' at ' + cryptoPrice.price + '$');
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', binancePrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log(e));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', coinbasePrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log(e));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', ftxPrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log(e));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', cryptoPrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log(e));
                });
            break;
        case 'LUNA':
            var getPriceFromBinance = request.buyOnBinance(crypto);
            var getPriceFromCrypto = request.buyOnCrypto(crypto);

            Promise.all([getPriceFromBinance, getPriceFromCrypto])
                .then(([binancePrice, cryptoPrice]) => {
                    //console.log('-> got buy price on binance for ' + crypto + ' at ' + binancePrice.price + '$');
                    //console.log('-> got buy price on crypto for ' + crypto + ' at ' + cryptoPrice.price + '$');
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', binancePrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log(e));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', cryptoPrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log(e));
                });
            break;
        default:
            console.log('Crypto not supported (yet!)');
    }
}

function getSellPrices(crypto) {
    switch (crypto) {
        case 'BTC':
        case 'ETH':
        case 'SOL':
        case 'LTC':
        case 'DOGE':
        case 'DOT':
            var getPriceFromKraken = request.sellOnKraken(crypto);
            var getPriceFromBinance = request.sellOnBinance(crypto);
            var getPriceFromCoinbase = request.sellOnCoinbase(crypto);
            var getPriceFromFtx = request.sellOnFtx(crypto);
            var getPriceFromCrypto = request.sellOnCrypto(crypto);

            Promise.all([getPriceFromKraken, getPriceFromBinance, getPriceFromCoinbase, getPriceFromFtx, getPriceFromCrypto])
                .then(([krakenPrice, binancePrice, coinbasePrice, ftxPrice, cryptoPrice]) => {
                    //console.log('-> got sell price on kraken for ' + crypto + ' at ' + krakenPrice.price + '$');
                    //console.log('-> got sell price on binance for ' + crypto + ' at ' + binancePrice.price + '$');
                    //console.log('-> got sell price on coinbase for ' + crypto + ' at ' + coinbasePrice.price + '$');
                    //console.log('-> got sell price on ftx for ' + crypto + ' at ' + ftxPrice.price + '$');
                    //console.log('-> got sell price on crypto for ' + crypto + ' at ' + cryptoPrice.price + '$');
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', krakenPrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log(e));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', binancePrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log(e));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', coinbasePrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log(e));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', ftxPrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log(e));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', cryptoPrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log(e));
                });
            break;
        case 'BNB':
            var getPriceFromBinance = request.sellOnBinance(crypto);
            var getPriceFromFtx = request.sellOnFtx(crypto);

            Promise.all([getPriceFromBinance, getPriceFromFtx])
                .then(([binancePrice, ftxPrice]) => {
                    //console.log('-> got sell price on binance for ' + crypto + ' at ' + binancePrice.price + '$');
                    //console.log('-> got sell price on ftx for ' + crypto + ' at ' + ftxPrice.price + '$');
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', binancePrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log(e));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', ftxPrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log(e));
                });
            break;
        case 'XRP':
            var getPriceFromKraken = request.sellOnKraken(crypto);
            var getPriceFromBinance = request.sellOnBinance(crypto);
            var getPriceFromFtx = request.sellOnFtx(crypto);
            var getPriceFromCrypto = request.sellOnCrypto(crypto);

            Promise.all([getPriceFromKraken, getPriceFromBinance, getPriceFromFtx, getPriceFromCrypto])
                .then(([krakenPrice, binancePrice, ftxPrice, cryptoPrice]) => {
                    //console.log('-> got sell price on kraken for ' + crypto + ' at ' + krakenPrice.price + '$');
                    //console.log('-> got sell price on binance for ' + crypto + ' at ' + binancePrice.price + '$');
                    //console.log('-> got sell price on ftx for ' + crypto + ' at ' + ftxPrice.price + '$');
                    //console.log('-> got sell price on crypto for ' + crypto + ' at ' + cryptoPrice.price + '$');
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', krakenPrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log(e));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', binancePrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log(e));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', ftxPrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log(e));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', cryptoPrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log(e));
                });
            break;
        case 'AVAX':
            var getPriceFromBinance = request.sellOnBinance(crypto);
            var getPriceFromCoinbase = request.sellOnCoinbase(crypto);
            var getPriceFromFtx = request.sellOnFtx(crypto);
            var getPriceFromCrypto = request.sellOnCrypto(crypto);

            Promise.all([getPriceFromBinance, getPriceFromCoinbase, getPriceFromFtx, getPriceFromCrypto])
                .then(([binancePrice, coinbasePrice, ftxPrice, cryptoPrice]) => {
                    //console.log('-> got sell price on binance for ' + crypto + ' at ' + binancePrice.price + '$');
                    //console.log('-> got sell price on coinbase for ' + crypto + ' at ' + coinbasePrice.price + '$');
                    //console.log('-> got sell price on ftx for ' + crypto + ' at ' + ftxPrice.price + '$');
                    //console.log('-> got sell price on crypto for ' + crypto + ' at ' + cryptoPrice.price + '$');
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', binancePrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log(e));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', coinbasePrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log(e));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', ftxPrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log(e));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', cryptoPrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log(e));
                });
            break;
        case 'LUNA':
            var getPriceFromBinance = request.sellOnBinance(crypto);
            var getPriceFromCrypto = request.sellOnCrypto(crypto);

            Promise.all([getPriceFromBinance, getPriceFromCrypto])
                .then(([binancePrice, cryptoPrice]) => {
                    //console.log('-> got sell price on binance for ' + crypto + ' at ' + binancePrice.price + '$');
                    //console.log('-> got sell price on crypto for ' + crypto + ' at ' + cryptoPrice.price + '$');
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', binancePrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log(e));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', cryptoPrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log(e));
                });
            break;
        default:
            console.log('Crypto not supported (yet!)');
    }
}

function getAllBuyPrices() {
    CRYPTOS.forEach(crypto => {
        getBuyPrices(crypto);
    });
}

function getAllSellPrices() {
    CRYPTOS.forEach(crypto => {
        getSellPrices(crypto);
    });
}

function getAllPrices() {
    getAllBuyPrices();
    getAllSellPrices();
}

// get crypto prices every 1 minute
setInterval(getAllPrices, 1 * 60 * 1000);

// API_KEY validation for requests to this service
app.use((req, res, next) => {
    if (req.header('Authorization') !== process.env.EXCHANGES_ADAPTER_KEY) {
        return res.status(401).send({ statusCode: 401, message: "unauthorized" });
    } else {
        next();
    }
});

app.listen(PORT, () => {
    console.log('Exchanges adapter layer listening on port ' + PORT);
});