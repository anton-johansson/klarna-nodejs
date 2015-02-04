var crypto = require('crypto');

var digest = function(arguments)
{
	if (!Array.isArray(arguments))
	{
		throw new Error("'arguments' must be an array");
	}

	var message = arguments.join(':');

	return crypto
		.createHash('sha256')
		.update(message)
		.digest('base64');
};

module.exports = digest;
