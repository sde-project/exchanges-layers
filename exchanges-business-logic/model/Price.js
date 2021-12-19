class Price {
    constructor(exchange, crypto, price, operation, date) {
        this.exchange = exchange;
        this.crypto = crypto;
        this.price = price;
        this.operation = operation;
        this.date = date;
    }
}

module.exports = Price;