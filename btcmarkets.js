var hmac = require("crypto").createHmac,
    axios = require('axios'),
    isEqual = require('lodash').isEqual;

function btcmarkets (key, secret) {
    var self = this;
    self.key = key;
    self.secret = secret;

    var request = function(path, reqOptions, postdata) {
        var nonce = new Date().getTime();

        var postdata = postdata || {};

        var stringmessage = `${path}\n${nonce}\n`;
        if (!isEqual(postdata, {})) {
            stringmessage += JSON.stringify(postdata)
        }

        var signedMessage = new hmac("sha512", Buffer.from(self.secret, 'base64'));

        signedMessage.update(stringmessage);

        var sign = signedMessage.digest('base64');

        var options = {
            baseURL: 'https://api.btcmarkets.net/',
            method: reqOptions.method !== undefined ? reqOptions.method : 'post',
            url: path,
            headers: {
                'Accept': 'application/json',
                'Accept-Charset': 'UTF-8',
                'Content-Type': 'application/json',
                'apikey': self.key,
                'timestamp': nonce,
                'signature': sign
            }
        };

        if (!isEqual(postdata, {})) {
            options.data = postdata;
        }
        return axios.request(options)
    }

    self.accountBalance = () => {
        return request('/account/balance', { method: 'get' }, undefined);
    }

    self.tradingFee = (currency, instrument) => {
        return request(`/account/${instrument}/${currency}/tradingfee`, { method: 'GET' }, undefined);
    }

    self.openOrders = (currency, instrument) => {
        return request('/order/open', {}, { currency, instrument, limit: 100, since: 1 });
    }

    self.orderHistory = (currency, instrument) => {
        return request('/order/history', {}, { currency, instrument, limit: 100, since: 1 });
    }

    self.createOrder = (currency, instrument, price, volume, orderSide, orderType) => {
        var data = {
            currency,
            instrument,
            price: Math.round(price * 100000000),
            volume: Math.round(volume * 100000000),
            orderSide,
            ordertype: orderType,
            clientRequestId: 'btcmarkets-api'
        }
        return request('/order/create', {}, data);
    }

    self.cancelOrder = (...orderIds) => {
        return request('/order/cancel', {}, { orderIds });
    }

    self.marketTick = (instrument, currency) => {
        return request(`/market/${instrument}/${currency}/tick`, { method: 'get' }, undefined)
    }

    self.marketOrderbook = (instrument, currency) => {
        return request(`/market/${instrument}/${currency}/orderbook`, { method: 'get' }, undefined)
    }

    self.marketTrades = (instrument, currency, since) => {
        let url = `/market/${instrument}/${currency}/trades`
        if (since !== undefined) {
            url = `${url}?since=${since}`
        }
        return request(url, { method: 'get' }, undefined)
    }

    self.withdrawEFT = (accountName, accountNumber, bankName, bsbNumber, amount) => {
        return request('/fundtransfer/withdrawEFT', {}, { accountName, accountNumber, bankName, bsbNumber, amount, currency: "AUD" });
    }

    self.withdrawCrypto =  (address, amount) => {
      return request('/fundtransfer/withdrawCrypto', {}, {address, amount, currency: "BTC"});
    }
}

module.exports = btcmarkets;
