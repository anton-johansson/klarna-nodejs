"use strict";

var utils = {};

/**
 * Gets the country from given country code.
 *
 * @param countryCode The code of the country, for example 'SE' or 'SWE'.
 */
utils.country = function(countryCode)
{
	switch (countryCode)
	{
		case 15:
		case 'AT':
		case 'AUT':
			return 15;

		case 59:
		case 'DK':
		case 'DNK':
			return 59;

		case 73:
		case 'FI':
		case 'FIN':
			return 73;

		case 81:
		case 'DE':
		case 'DEU':
			return 81;

		case 154:
		case 'NL':
		case 'NLD':
			return 154;

		case 164:
		case 'NO':
		case 'NOR':
			return 164;

		case 209:
		case 'SE':
		case 'SWE':
			return 209;
	}

	throw new Error('Invalid country');
};

module.exports = utils;
