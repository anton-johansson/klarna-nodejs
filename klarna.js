var digest = require('./modules/digest');
var xmlrpc = require('xmlrpc');

function Klarna(parameters)
{
	this.eid = parameters.eid;
	this.sharedSecret = parameters.sharedSecret;
};

Klarna.prototype.getAddresses = function(socialSecurityNumber, successCallback, errorCallback)
{
	var client = xmlrpc.createClient('http://payment.testdrive.klarna.com:80');

	var digestSecret = digest([this.eid, socialSecurityNumber, this.sharedSecret]);
	var params = ['4.1', 'nodejs:api:0.0.0', socialSecurityNumber, this.eid, digestSecret, 2, 5, '192.168.1.10'];
	client.methodCall('get_addresses', params, function(error, value)
	{
		if (value)
		{
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

			successCallback(addresses);
		}
		else
		{
			var error =
			{
				code: error.code,
				faultString: error.faultString
			};

			errorCallback(error);
		}
	});
};

module.exports = Klarna;
