var hmac = require("crypto").createHmac,
    https = require('https'),
    isEqual = require('lodash').isEqual;

function btcmarkets (key, secret) {
    var self = this;
    self.key = key;
    self.secret = secret;

    var request = function(path, reqOptions, postdata, callback) {
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
            rejectUnauthorized: false,
            method: reqOptions.method !== undefined ? reqOptions.methd : 'POST',
            host: 'api.btcmarkets.net',
            port: 443,
            path: path,
            headers: {
                'Accept': 'application/json',
                'Accept-Charset': 'UTF-8',
                'Content-Type': 'application/json',
                'apikey': self.key,
                'timestamp': nonce,
                'signature': sign
            }
        };

        var req = https.request(options, resp => {
            var data = '';
            resp.on('data', function(chunk){
                data += chunk;
            });
            resp.on('end', function(chunk){
                callback(null, data);
            });
        }).on("error", function(e){
            callback(e, data);
        });

        if (!isEqual(postdata, {})) {
            req.write(JSON.stringify(postdata));
        }
        req.end();
    }

    self.accountBalance = callback => {
        request('/account/balance', { method: 'GET' }, undefined, callback);
    }

    self.tradingFee = (currency, instrument, callback) => {
        request(`/account/${instrument}/${currency}/tradingfee`, { method: 'GET' }, undefined, callback);
    }

    self.openOrders = (currency, instrument, callback) => {
        request('/order/open', {}, { currency, instrument, limit: 100, since: 1 }, callback);
    }

    self.orderHistory = (currency, instrument, callback) => {
        request('/order/history', {}, { currency, instrument, limit: 100, since: 1 }, callback);
    }

    self.createOrder = (currency, instrument, price, volume, orderSide, orderType, callback) => {
        var data = {
            currency,
            instrument,
            price: price * 100000000,
            volume: volume * 100000000,
            orderSide,
            ordertype: orderType,
            clientRequestId: 'btcmarkets-api'
        }
        request('/order/create', {}, data, callback);
    }

    self.cancelOrder = (callback, ...orderIds) => {
        request('/order/cancel', {}, { orderIds }, callback);
    }
}

module.exports = btcmarkets;
