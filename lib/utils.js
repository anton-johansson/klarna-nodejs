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

/**
 * Gets the currency for the given country.
 *
 * @param country The country to get the currency for.
 */
utils.currencyByCountry = function(country)
{
	switch (country)
	{
		case  15: return 2;
		case  59: return 3;
		case  73: return 2;
		case  81: return 2;
		case 154: return 2;
		case 164: return 1;
		case 209: return 0;
	}

	throw new Error('Invalid country');
};

/**
 * Gets the language for the given country.
 *
 * @param country The country to get the language for.
 */
utils.languageByCountry = function(country)
{
	switch (country)
	{
		case  15: return  28;
		case  59: return  27;
		case  73: return  37;
		case  81: return  28;
		case 154: return 101;
		case 164: return  97;
		case 209: return 138;
	}

	throw new Error('Invalid country');
};

module.exports = utils;
