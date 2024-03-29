require('dotenv').config();

const express = require('express');
const app = express();

const axios = require('axios');

const Price = require('./model/Price');
const RequestManager = require('./wrappers/RequestManager');
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
                        .catch(e => console.log('error saving buy price for '+ crypto + ' on kraken'));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', binancePrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log('error saving buy price for '+ crypto + ' on binance'));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', coinbasePrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log('error saving buy price for '+ crypto + ' on coinbase'));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', ftxPrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log('error saving buy price for '+ crypto + ' on ftx'));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', cryptoPrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log('error saving buy price for '+ crypto + ' on crypto.com'));
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
                        .catch(e => console.log('error saving buy price for '+ crypto + ' on binance'));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', ftxPrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log('error saving buy price for '+ crypto + ' on ftx'));
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
                        .catch(e => console.log('error saving buy price for '+ crypto + ' on kraken'));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', binancePrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log('error saving buy price for '+ crypto + ' on binance'));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', ftxPrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log('error saving buy price for '+ crypto + ' on ftx'));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', cryptoPrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log('error saving buy price for '+ crypto + ' on crypto.com'));
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
                        .catch(e => console.log('error saving buy price for '+ crypto + ' on binance'));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', coinbasePrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log('error saving buy price for '+ crypto + ' on coinbase'));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', ftxPrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log('error saving buy price for '+ crypto + ' on ftx'));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', cryptoPrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log('error saving buy price for '+ crypto + ' on crypto.com'));
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
                        .catch(e => console.log('error saving buy price for '+ crypto + ' on binance'));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', cryptoPrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log('error saving buy price for '+ crypto + ' on crypto.com'));
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
                        .catch(e => console.log('error saving sell price for '+ crypto + ' on kraken'));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', binancePrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log('error saving sell price for '+ crypto + ' on binance'));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', coinbasePrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log('error saving sell price for '+ crypto + ' on coinbase'));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', ftxPrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log('error saving sell price for '+ crypto + ' on ftx'));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', cryptoPrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log('error saving sell price for '+ crypto + ' on crypto.com'));
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
                        .catch(e => console.log('error saving sell price for '+ crypto + ' on binance'));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', ftxPrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log('error saving sell price for '+ crypto + ' on ftx'));
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
                        .catch(e => console.log('error saving sell price for '+ crypto + ' on kraken'));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', binancePrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log('error saving sell price for '+ crypto + ' on binance'));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', ftxPrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log('error saving sell price for '+ crypto + ' on ftx'));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', cryptoPrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log('error saving sell price for '+ crypto + ' on crypto.com'));
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
                        .catch(e => console.log('error saving sell price for '+ crypto + ' on binance'));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', coinbasePrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log('error saving sell price for '+ crypto + ' on coinbase'));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', ftxPrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log('error saving sell price for '+ crypto + ' on ftx'));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', cryptoPrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log('error saving sell price for '+ crypto + ' on crypto.com'));
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
                        .catch(e => console.log('error saving sell price for '+ crypto + ' on binance'));
                    axios.post(process.env.DATA_ADAPTER_HOST + '/price', cryptoPrice, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
                        .catch(e => console.log('error saving sell price for '+ crypto + ' on crypto.com'));
                });
            break;
        default:
            console.log('Crypto not supported (yet!)');
    }
}

function getAllBuyPrices() {
    console.log('getting all buy prices');
    CRYPTOS.forEach(crypto => {
        getBuyPrices(crypto);
    });
}

function getAllSellPrices() {
    console.log('getting all sell prices');
    CRYPTOS.forEach(crypto => {
        getSellPrices(crypto);
    });
}

function getAllPrices() {
    getAllBuyPrices();
    getAllSellPrices();
}

const TIMER = process.env.TIMER || 5 * 60 * 1000;

// get crypto prices every 5 minute
setInterval(getAllPrices, TIMER);

// API_KEY validation for requests to this service
app.use((req, res, next) => {
    if (req.header('Authorization') !== process.env.EXCHANGES_ADAPTER_KEY) {
        return res.status(401).send({ statusCode: 401, message: "unauthorized" });
    } else {
        next();
    }
});

/*
const PORT = process.env.PORT || 2903;

app.listen(PORT, () => {
    console.log('Exchanges adapter layer listening on port ' + PORT);
});
*/