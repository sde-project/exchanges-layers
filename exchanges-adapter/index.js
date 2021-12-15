const express = require('express');
const app = express();

const mongoose = require('mongoose');
const axios = require('axios');

const Price = require('./model/Price');

const COINS = ['BTC', 'ETH'];

function getBuyPrices (coin) {
    var getPriceFromKraken = axios
    .get('https://api.kraken.com/0/public/Ticker?pair=' + coin + 'USD')
    .then(response => response.data)
    .then(data => new Price('Kraken', coin, Number(data.result[Object.keys(data.result)].a[0]), Date.now()));

    var getPriceFromBinance = axios
    .get('https://api.binance.com/api/v3/ticker/price?symbol=' + coin + 'USDT')
    .then(response => response.data)
    .then(data => new Price('Binance', coin, data.price, Date.now()));

    var getPriceFromCoinbase = axios
    .get('https://api.coinbase.com/v2/prices/' + coin + '-USD/buy')
    .then(response => response.data)
    .then(data => new Price('Coinbase', coin, data.data.amount, Date.now()));

    var getPriceFromFTX = axios
    .get('https://ftx.com/api/markets/' + coin + '/USD')
    .then(response => response.data)
    .then(data => new Price('FTX', coin, data.result.bid, Date.now()));

    var getPriceFromCryptoCom = axios
    .get('https://api.crypto.com/v2/public/get-ticker?instrument_name=' + coin + '_USDT')
    .then(response => response.data)
    .then(data => new Price('Crypto.com', coin, data.result.data.a, Date.now()));

    Promise.all([getPriceFromKraken, getPriceFromBinance, getPriceFromCoinbase, getPriceFromFTX, getPriceFromCryptoCom])
    .then(([kraken, binance, coinbase, ftx, crypto]) => {
        console.log('-> got buy price on kraken for ' + coin + ' at ' + kraken.price + '$');
        console.log('-> got buy price on binance for ' + coin + ' at ' + binance.price + '$');
        console.log('-> got buy price on coinbase for ' + coin + ' at ' + coinbase.price + '$');
        console.log('-> got buy price on ftx for ' + coin + ' at ' + ftx.price + '$');
        console.log('-> got buy price on crypto for ' + coin + ' at ' + crypto.price + '$');
    });
}

function getSellPrices (coin) {
    var getPriceFromKraken = axios
    .get('https://api.kraken.com/0/public/Ticker?pair=' + coin + 'USD')
    .then(response => response.data)
    .then(data => new Price('Kraken', coin, Number(data.result[Object.keys(data.result)].b[0]), Date.now()));

    var getPriceFromBinance = axios
    .get('https://api.binance.com/api/v3/ticker/price?symbol=' + coin + 'USDT')
    .then(response => response.data)
    .then(data => new Price('Binance', coin, data.price, Date.now()));

    var getPriceFromCoinbase = axios
    .get('https://api.coinbase.com/v2/prices/' + coin + '-USD/sell')
    .then(response => response.data)
    .then(data => new Price('Coinbase', coin, data.data.amount, Date.now()));

    var getPriceFromFTX = axios
    .get('https://ftx.com/api/markets/' + coin + '/USD')
    .then(response => response.data)
    .then(data => new Price('FTX', coin, data.result.ask, Date.now()));

    var getPriceFromCryptoCom = axios
    .get('https://api.crypto.com/v2/public/get-ticker?instrument_name=' + coin + '_USDT')
    .then(response => response.data)
    .then(data => new Price('Crypto.com', coin, data.result.data.b, Date.now()));

    Promise.all([getPriceFromKraken, getPriceFromBinance, getPriceFromCoinbase, getPriceFromFTX, getPriceFromCryptoCom])
    .then(([kraken, binance, coinbase, ftx, crypto]) => {
        console.log('-> got sell price on kraken for ' + coin + ' at ' + kraken.price + '$');
        console.log('-> got sell price on binance for ' + coin + ' at ' + binance.price + '$');
        console.log('-> got sell price on coinbase for ' + coin + ' at ' + coinbase.price + '$');
        console.log('-> got sell price on ftx for ' + coin + ' at ' + ftx.price + '$');
        console.log('-> got sell price on crypto for ' + coin + ' at ' + crypto.price + '$');
    });
}

function getAllBuyPrices() {
    COINS.forEach(coin => {
        getBuyPrices(coin);
    });
}

function getAllSellPrices() {
    COINS.forEach(coin => {
        getSellPrices(coin);
    });
}

function getAllPrices() {
    getAllBuyPrices();
    getAllSellPrices();
}

setInterval(getAllPrices, 5*1000);