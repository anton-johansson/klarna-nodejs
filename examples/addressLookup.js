"use strict";

/**
 * The purpose of this example is to demonstrate how a simple address lookup
 * against Klarnas API is performed.
 *
 * To perform this test, you require account information that you can receive
 * from Klarna.
 */

var Klarna = require('../lib/klarna');

// Configure klarna parameters
var parameters =
{
	eid: 1,
	sharedSecret: '...',
	url: 'https://payment.testdrive.klarna.com:443'
};

// Create the Klarna service
var klarna = new Klarna(parameters);

// Get addresses of a person
console.log('Get addresses of a person');
klarna.getAddresses('127.0.0.1', 'SE', '410321-9202', function(error, addresses)
{
	console.log(error || addresses);
});

// Get addresses of a company
console.log('Get addresses of a company');
klarna.getAddresses('127.0.0.1', 'SE', '002031-0132', function(error, addresses)
{
	console.log(error || addresses);
});
