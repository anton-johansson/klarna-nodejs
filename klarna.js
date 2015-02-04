var digest = require('./modules/digest');
var xmlrpc = require('xmlrpc');

// Constants
var PROTO = '4.1';
var VERSION = 'nodejs:api:0.0.0';

// Constructor
function Klarna(parameters)
{
	this.eid = parameters.eid;
	this.sharedSecret = parameters.sharedSecret;
	this.address = parameters.address;

	// Internal caller
	this.xmlrpcCall = function(method, parameters, successCallback, errorCallback)
	{
		// Create client
		var client = this.createClient();

		// Add standard parameters
		parameters.unshift(VERSION);
		parameters.unshift(PROTO);

		// Make the call
		client.methodCall(method, parameters, function(error, value)
		{
			if (value)
			{
				successCallback(value);
			}
			else
			{
				errorCallback(error);
			}
		});
	}

	// Creates the XMLRPC client
	this.createClient = function()
	{
		console.log('test: ' + this.address);
		if (this.address.indexOf('https') === 0)
		{
			return xmlrpc.createSecureClient(this.address);
		}
		else
		{
			return xmlrpc.createClient(this.address);
		}
	}
};

// Gets a list of addresses for persons or companies
Klarna.prototype.getAddresses = function(socialSecurityNumber, successCallback, errorCallback)
{
	// Create digest
	var digestSecret = digest([this.eid, socialSecurityNumber, this.sharedSecret]);

	// Create list of parameters
	var parameters = [socialSecurityNumber, this.eid, digestSecret, 2, 5, '192.168.1.10'];

	// Make the XMLRPC call
	this.xmlrpcCall('get_addresses', parameters, function(value)
	{
		var addresses = [];
		value.forEach(function(item)
		{
			var address = {};
			address.isCompany = (item.length == 5) ? true : false;
			if (address.isCompany)
			{
				address.companyName = item[0];
				address.street = item[1];
				address.zipCode = item[2];
				address.city = item[3];
				address.country = item[4];
			}
			else
			{
				address.firstName = item[0];
				address.lastName = item[1];
				address.street = item[2];
				address.zipCode = item[3];
				address.city = item[4];
				address.country = item[5];
			}
			addresses.push(address);
		});

		successCallback(addresses);
	}, function(error)
	{
		var error =
		{
			code: error.code,
			faultString: error.faultString
		};

		errorCallback(error);
	});
};

// Export the service
module.exports = Klarna;
