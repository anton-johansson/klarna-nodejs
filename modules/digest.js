var crypto = require('crypto');

var digest = function(arguments)
{
	// Assert that the parameter is an actual array
	if (!Array.isArray(arguments))
	{
		throw new Error("'arguments' must be an array");
	}

	// Join the arguments and separate them with a semi colon
	var message = arguments.join(':');

	// Digest the string
	return crypto
		.createHash('sha256')
		.update(message)
		.digest('base64');
};

module.exports = digest;
