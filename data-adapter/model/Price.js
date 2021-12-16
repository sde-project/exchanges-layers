const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
    exchange: String,
    crypto: String,
    price: Number,
    operation: String,
    data: Date
});

const priceModel = mongoose.model('Price', priceSchema);

module.exports = priceModel;