var crypto = require('crypto');

var digest = function(arguments)
{
	var message = arguments.join(':');

	return crypto
		.createHash('sha256')
		.update(message)
		.digest('base64');
};

module.exports = digest;
