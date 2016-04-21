"use strict";

var validator = require('validator');

var validate = {};

/**
 * Validates the eid.
 *
 * @param eid The eid to validate.
 */
validate.eid = function(eid)
{
	return validator.isInt(eid, { min: 1 });
};

/**
 * Validates the shared secret.
 *
 * @param sharedSecret The shared secret to validate.
 */
validate.sharedSecret = function(sharedSecret)
{
    return validator.isLength(sharedSecret, 1);
};

/**
 * Validates the Klarna server URL.
 *
 * @param url The url to validate.
 */
validate.url = function(url)
{
    return validator.isURL(url, { protocols: ['http', 'https'], require_protocol: true, require_valid_protocol: true });
};

/**
 * Validates the client IP address.
 *
 * @param clientIP The client IP address to validate.
 */
validate.clientIP = function(clientIP)
{
    return validator.isIP(clientIP);
};

/**
 * Validates the social security or organization number.
 *
 * @param number The social security or organization number to validate.
 */
validate.number = function(number)
{
    return validator.isLength(number, 1);
};

module.exports = validate;
