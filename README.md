# klarna-nodejs [![NPM version](https://img.shields.io/npm/v/klarna-nodejs.svg)](https://www.npmjs.com/package/klarna-nodejs) [![Build Status](https://img.shields.io/travis/anton-johansson/klarna-nodejs.svg)](https://travis-ci.org/anton-johansson/klarna-nodejs) [![Coverage](https://img.shields.io/coveralls/anton-johansson/klarna-nodejs.svg)](https://coveralls.io/r/anton-johansson/klarna-nodejs) ![Dependencies](https://img.shields.io/david/anton-johansson/klarna-nodejs.svg)

> A simple wrapper around [Klarnas](http://www.klarna.com/) [XMLRPC API](http://developer.klarna.com/en/se+java/kpm/checkout-api), written in nodejs.


## Install

```
$ npm install --save klarna-nodejs
```


## Usage

```js
var Klarna = require('klarna-nodejs');

var configuration =
{
    eid: 1,
    sharedSecret: '...',
	url: 'https://payment.testdrive.klarna.com:443'
};

var klarna = new Klarna(configuration);

var result = klarna.getAddresses('127.0.0.1', 'SE', '1234567');

```


## Examples

See examples [here](examples/).


## API

### .getAddresses(clientIP, country, number, callback)

Gets the addresses for given social security number or organization number.

#### clientIP

> Type: `string`
>
> The IP address of the client on behalf of which we are making this call.

#### country

> Type: `string`
>
> The country to perform the check against (ex. 'SE' for Sweden).

#### number

> Type: `string`
>
> The social security or organization number.

#### callback(error, addresses)

> Type: `function`
>
> ##### addresses
> Type: `array`
>
> The found addresses.


### .cancelReservation(rno, callback)

Cancel a reservation.

#### rno

> Type: `string`
>
> The reservation number to cancel.

#### callback(error, response)

> Type: `function`
>
> ##### response
> Type: `string`
>
> Should be the string 'OK'.


## License

Apache License © [Anton Johansson](https://github.com/anton-johansson)
