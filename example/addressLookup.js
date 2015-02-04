/**
 * The purpose of this example is to demonstrate how a simple address lookup
 * against Klarnas API is performed.
 *
 * To perform this test, you require account information that you can receive
 * from Klarna.
 */

var Klarna = require('../index');

// Configure klarna parameters
var parameters =
{
	eid: 1,
	sharedSecret: '...'
};

// Create the klarna service
var klarna = new Klarna(parameters);

// Get addresses of a person
console.log('Get addresses of a person');
klarna.getAddresses('410321-9202', function(value)
{
	console.log(value);
},
function(error)
{
	console.log(error);
});

// Get addresses of a company
console.log('Get addresses of a company');
klarna.getAddresses('002031-0132', function(value)
{
	console.log(value);
},
function(error)
{
	console.log(error);
});