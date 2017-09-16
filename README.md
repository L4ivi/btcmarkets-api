Please see [https://github.com/BTCMarkets/API](https://github.com/BTCMarkets/API) for documentation on the BTC Markets API.


Example usage

```javascript
var btcmarkets = require('btcmarkets-api');

var secret = ''; // insert your secret here
var key = ''; // insert your key here

var client = new btcmarkets(key, secret);

client.accountBalance().then(response => {
    console.log(response.data)
})

client.tradingFee('AUD', 'BTC').then(response => {
    console.log(response.data)
})
```


### Note

I am in no way associated with BTC Markets, I have just developed a Node plugin
that utilises their available API and published it as a module. There is no warranty
with this code and I will not be held liable if something goes wrong. Make sure you
check the code before you use it.

### License

This code is released under the MIT license.

Copyright 2017 Mathew Munn

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
