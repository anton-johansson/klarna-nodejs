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
	// Set/Reset Config
	this.setConfig = function(parameters) {
		this.config = {};
		this.config.eid = parameters.eid;
		this.config.sharedSecret = parameters.sharedSecret;
		this.config.url = parameters.url;

		// Validations
		validateField(validate.eid, this.config.eid, "'eid' must be a positive number");
		validateField(validate.sharedSecret, this.config.sharedSecret, "'sharedSecret' must be a non-empty string");
		validateField(validate.url, this.config.url, "'url' must be a proper URL");

	};

	this.setConfig(parameters);

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
		if (this.config.url.indexOf('https') === 0)
		{
			return xmlrpc.createSecureClient(this.config.url);
		}
		else
		{
			return xmlrpc.createClient(this.config.url);
		}
	};
}

/**
 * Cancel a reservation.
 *
 * @param rno The number of the reservation to cancel.
 */
Klarna.prototype.cancelReservation = function(rno, callback)
{
	// Validations
	validateField(validate.rno, rno, "'rno' is not a valid reservation number");

	// Create digest
	var digestSecret = digest([this.config.eid, rno, this.config.sharedSecret]);

	// Create list of parameters
	var parameters = [rno, this.config.eid, digestSecret];

	// Make the XMLRPC call
	this.execute('cancel_reservation', parameters, function(error, value)
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

		callback(undefined, value);
	});

};

/**
 * Gets a list of addresses for persons or companies.
 *
 * @param pno The social security number (person number) or organization number to look up addresses for.
 */
Klarna.prototype.getAddresses = function(clientIP, country, pno, callback)
{
	country = utils.country(country);
	var currency = utils.currencyByCountry(country);
	var language = utils.languageByCountry(country);

	// Validations
	validateField(validate.clientIP, clientIP, "'clientIP' is not a valid IP-address");
	validateField(validate.pno, pno, "'pno' is not valid");

	// Create digest
	var digestSecret = digest([this.config.eid, pno, this.config.sharedSecret]);

	// Create list of parameters
	var parameters = [pno, this.config.eid, digestSecret, 2, 5, clientIP];

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
