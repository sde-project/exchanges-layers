class Price {
    constructor(exchange, crypto, price, operation, data) {
        this.exchange = exchange;
        this.crypto = crypto;
        this.price = price;
        this.operation = operation;
        this.data = data;
    }
}

module.exports = Price;