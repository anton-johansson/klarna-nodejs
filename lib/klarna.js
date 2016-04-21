"use strict";

var digest = require('./digest');
var utils = require('./utils');
var validate = require('./validate');
var xmlrpc = require('xmlrpc');

// Constants
var PROTO = '4.1';
var VERSION = 'nodejs:api:2.0.0';

/**
 * Constructs a new Klarna service instance.
 *
 * @param parameters The parameters to initialize the instance with.
 * @constructor
 */
function Klarna(parameters)
{
	this.eid = parameters.eid;
	this.sharedSecret = parameters.sharedSecret;
	this.url = parameters.url;
	this.clientIP = parameters.clientIP;

	if (parameters.country)
	{
		this.country = utils.country(parameters.country);
		this.currency = utils.currencyByCountry(this.country);
		this.language = utils.languageByCountry(this.country);
	}

	// Validations
	validateField(validate.eid, this.eid, "'eid' must be a positive number");
	validateField(validate.sharedSecret, this.sharedSecret, "'sharedSecret' must be a non-empty string");
	validateField(validate.url, this.url, "'address' must be a proper URL");

	/**
	 * Internal caller.
	 */
	this.execute = function(method, parameters, callback)
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
				callback(undefined, value);
			}
			else
			{
				callback(error);
			}
		});
	};

	/**
	 * Creates the XMLRPC client.
	 */
	this.createClient = function()
	{
		if (this.url.indexOf('https') === 0)
		{
			return xmlrpc.createSecureClient(this.url);
		}
		else
		{
			return xmlrpc.createClient(this.url);
		}
	};
}

/**
 * Gets a list of addresses for persons or companies.
 *
 * @param number The social security number or organization number to look up addresses for.
 */
Klarna.prototype.getAddresses = function(number, callback)
{
	// Validations
	validateField(validate.clientIP, this.clientIP, "'clientIP' is not a valid IP-address");
	validateField(validate.number, number, "'number' is not valid");

	// Create digest
	var digestSecret = digest([this.eid, number, this.sharedSecret]);

	// Create list of parameters
	var parameters = [number, this.eid, digestSecret, 2, 5, this.clientIP];

	// Make the XMLRPC call
	this.execute('get_addresses', parameters, function(error, value)
	{
		if (error)
		{
			var errorBody =
			{
				code: error.code,
				faultString: error.faultString
			};

			callback(errorBody);
			return;
		}

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

		callback(undefined, addresses);
	});
};

var validateField = function(validationFunction, validationField, errorMessage)
{
	if (!validationFunction(validationField))
	{
		throw new Error(errorMessage);
	}
};

// Export the service
module.exports = Klarna;
