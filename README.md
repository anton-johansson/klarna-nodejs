# klarna-nodejs [![NPM version](https://img.shields.io/npm/v/klarna-nodejs.svg)](https://www.npmjs.com/package/klarna-nodejs) [![Build Status](https://img.shields.io/travis/anton-johansson/klarna-nodejs.svg)](https://travis-ci.org/anton-johansson/klarna-nodejs) [![Coverage](https://img.shields.io/coveralls/anton-johansson/klarna-nodejs.svg)](https://coveralls.io/r/anton-johansson/klarna-nodejs) ![Dependencies](https://img.shields.io/david/anton-johansson/klarna-nodejs.svg)

> A simple wrapper around [Klarnas](http://www.klarna.com/) XMLRPC API, written in nodejs.


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
	address: 'https://payment.testdrive.klarna.com:443'
};

var klarna = new Klarna(configuration);
```


## API

### .getAddresses(number, callback)

Gets the addresses for given social security number or organization number.

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


## Examples

See examples [here](examples/).


## License

Apache License © [Anton Johansson](http://github.com/anton-johansson)
