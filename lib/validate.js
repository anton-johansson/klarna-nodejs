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
 * Validates the host address.
 *
 * @param address The address to validate.
 */
validate.address = function(address)
{
    return validator.isURL(address, { protocols: ['http', 'https'], require_protocol: true, require_valid_protocol: true });
};

module.exports = validate;
