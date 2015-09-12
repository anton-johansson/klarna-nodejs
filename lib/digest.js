"use strict";

var crypto = require('crypto');

var digest = function(parameters)
{
	// Assert that the parameter is an actual array
	if (!Array.isArray(parameters))
	{
		throw new Error("'parameters' must be an array");
	}

	// Join the parameters and separate them with a semi colon
	var message = parameters.join(':');

	// Digest the string
	return crypto
		.createHash('sha256')
		.update(message)
		.digest('base64');
};

module.exports = digest;
