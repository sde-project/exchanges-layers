require('dotenv').config();

const express = require('express');
const app = express();

const PORT = process.env.PORT || 2902;

const axios = require('axios');

const Price = require('./model/Price');

const EXCHANGES = ['Kraken', 'Binance', 'Coinbase', 'FTX', 'Crypto.com'];
const CRYPTOS = ['BTC', 'ETH', 'BNB', 'SOL', 'DOGE', 'XRP', 'DOT', 'AVAX', 'LTC', 'LUNA'];
const OPERATIONS = ['buy', 'sell'];

const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

const fs = require('fs');

app.use(express.json());

app.get('/chart', async (req, res) => {
    axios.get(process.env.DATA_ADAPTER_HOST + '/price/crypto/BTC/since/2021-12-18T13:00:00.000Z/operation/buy/exchange/FTX', { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
        .then(prices => prices.data)
        .then(prices => {
            var pricesValues = [];
            var datesLabels = [];
            prices.forEach(price => {
                pricesValues.push(Number(price['price']));
                let date = new Date(Date.parse(price['date']));
                datesLabels.push(date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + (date.getHours() - 1) + ':' + date.getMinutes() + ':' + date.getSeconds());
            });
            const configuration = {
                type: 'line',
                data: {
                    labels: datesLabels,
                    datasets: [
                        {
                            label: 'Prices in $ for buying BTC on FTX',
                            data: pricesValues,
                            borderColor: 'purple',
                        }
                    ]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: false
                        }
                    }
                }
            }
            createPlot(configuration);
            res.status(200).send({ statusCode: 200, message: 'chart generated!', configuration: configuration });
        });
});

app.get('/chart/image/crypto/:crypto/since/:date/operation/:operation/exchange/:exchange', async (req, res) => {
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
        axios.get(process.env.DATA_ADAPTER_HOST + '/price/crypto/'+crypto+'/since/'+req.params.date+'/operation/'+operation+'/exchange/'+exchange, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
            .then(prices => prices.data)
            .then(prices => {
                var pricesValues = [];
                var datesLabels = [];
                prices.forEach(price => {
                    pricesValues.push(Number(price['price']));
                    let date = new Date(Date.parse(price['date']));
                    datesLabels.push(date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + (date.getHours() - 1) + ':' + date.getMinutes() + ':' + date.getSeconds());
                });
                const configuration = {
                    type: 'line',
                    data: {
                        labels: datesLabels,
                        datasets: [
                            {
                                label: 'Prices in $ for ' + operation + 'ing ' + crypto + ' on ' + exchange,
                                data: pricesValues,
                                borderColor: 'purple',
                            }
                        ]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: false
                            }
                        }
                    }
                }
                createPlot(configuration);
                //res.status(200).sendFile(path.join(__dirname, '/chart.png'));
                res.status(200).sendFile({ statusCode: 200, message: 'chart generated!', configuration: configuration });
            });
    }
});

app.get('/chart/dataset/crypto/:crypto/since/:date/operation/:operation/exchange/:exchange', (req, res) => {
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
        axios.get(process.env.DATA_ADAPTER_HOST + '/price/crypto/'+crypto+'/since/'+req.params.date+'/operation/'+operation+'/exchange/'+exchange, { headers: { 'Authorization': process.env.DATA_ADAPTER_KEY } })
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
                switch(exchange) {
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
                res.status(200).send({ statusCode: 200, message: 'dataset generated!', dataset: dataset, dates: datesLabels });
            });
    }
});

const width = 1600;
const height = 900;
const backgroundColor = 'white';
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColor });
async function createPlot(configuration) {
    const image = await chartJSNodeCanvas.renderToBuffer(configuration, 'image/png');
    fs.writeFileSync('chart.png', image);
}

const path = require('path');
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/prova.html'));
});

app.listen(PORT, () => {
    console.log('Exchanges business logic listening on port ' + PORT);
})