const mongoose = require('mongoose');

// TODO: improve schema?
const priceSchema = new mongoose.Schema({
    exchange: String,
    crypto: String,
    price: Number,
    operation: String,
    date: Date
});

const priceModel = mongoose.model('Price', priceSchema);

module.exports = priceModel;