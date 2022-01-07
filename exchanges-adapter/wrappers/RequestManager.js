const axios = require('axios');

const Price = require('../model/Price');

// not sure about this
const TIME_OFFSET = 3660000;

class RequestManager {
    constructor() { }

    buyOnKraken(crypto) {
        return axios
            .get('https://api.kraken.com/0/public/Ticker?pair=' + crypto + 'USD')
            .then(response => response.data)
            .then(data => new Price('Kraken', crypto, Number(data.result[Object.keys(data.result)].a[0]), 'buy', Date.now()+TIME_OFFSET))
            .catch(error => {
                console.log('error in getting buy price of ' + crypto + ' from Kraken');
                console.log(error);
            });
    }

    buyOnBinance(crypto) {
        return axios
            .get('https://api.binance.com/api/v3/ticker/price?symbol=' + crypto + 'USDT')
            .then(response => response.data)
            .then(data => new Price('Binance', crypto, data.price, 'buy', Date.now()+TIME_OFFSET))
            .catch(error => {
                console.log('error in getting buy price of ' + crypto + ' from Binance');
                console.log(error);
            });
    }

    buyOnCoinbase(crypto) {
        return axios
            .get('https://api.coinbase.com/v2/prices/' + crypto + '-USD/buy')
            .then(response => response.data)
            .then(data => new Price('Coinbase', crypto, data.data.amount, 'buy', Date.now()+TIME_OFFSET))
            .catch(error => {
                console.log('error in getting buy price of ' + crypto + ' from Coinbase');
                console.log(error);
            });
    }

    buyOnFtx(crypto) {
        return axios
            .get('https://ftx.com/api/markets/' + crypto + '/USD')
            .then(response => response.data)
            .then(data => new Price('FTX', crypto, data.result.ask, 'buy', Date.now()+TIME_OFFSET))
            .catch(error => {
                console.log('error in getting buy price of ' + crypto + ' from FTX');
                console.log(error.response.data);
            });
    }

    buyOnCrypto(crypto) {
        return axios
            .get('https://api.crypto.com/v2/public/get-ticker?instrument_name=' + crypto + '_USDT')
            .then(response => response.data)
            .then(data => new Price('Crypto.com', crypto, data.result.data.a, 'buy', Date.now()+TIME_OFFSET))
            .catch(error => {
                console.log('error in getting buy price of ' + crypto + ' from Crypto.com');
                console.log(error);
            });
    }

    sellOnKraken(crypto) {
        return axios
            .get('https://api.kraken.com/0/public/Ticker?pair=' + crypto + 'USD')
            .then(response => response.data)
            .then(data => new Price('Kraken', crypto, Number(data.result[Object.keys(data.result)].b[0]), 'sell', Date.now()+TIME_OFFSET))
            .catch(error => {
                console.log('error in getting sell price of ' + crypto + ' from Kraken');
                console.log(error);
            });
    }

    sellOnBinance(crypto) {
        return axios
            .get('https://api.binance.com/api/v3/ticker/price?symbol=' + crypto + 'USDT')
            .then(response => response.data)
            .then(data => new Price('Binance', crypto, data.price, 'sell', Date.now()+TIME_OFFSET))
            .catch(error => {
                console.log('error in getting sell price of ' + crypto + ' from Binance');
                console.log(error);
            });
    }

    sellOnCoinbase(crypto) {
        return axios
        .get('https://api.coinbase.com/v2/prices/' + crypto + '-USD/sell')
        .then(response => response.data)
        .then(data => new Price('Coinbase', crypto, data.data.amount, 'sell', Date.now()+TIME_OFFSET))
        .catch(error => {
            console.log('error in getting sell price of ' + crypto + ' from Coinbase');
            console.log(error);
        });
    }

    sellOnFtx(crypto) {
        return axios
        .get('https://ftx.com/api/markets/' + crypto + '/USD')
        .then(response => response.data)
        .then(data => new Price('FTX', crypto, data.result.bid, 'sell', Date.now()+TIME_OFFSET))
        .catch(error => {
            console.log('error in getting sell price of ' + crypto + ' from FTX');
            console.log(error.response.data);
        });
    }

    sellOnCrypto(crypto) {
        return axios
        .get('https://api.crypto.com/v2/public/get-ticker?instrument_name=' + crypto + '_USDT')
        .then(response => response.data)
        .then(data => new Price('Crypto.com', crypto, data.result.data.b, 'sell', Date.now()+TIME_OFFSET))
        .catch(error => {
            console.log('error in getting sell price of ' + crypto + ' from Crypto.com');
            console.log(error);
        });
    }

}

module.exports = RequestManager;