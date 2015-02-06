var proxyquire = require('proxyquire');
var assert = require('assert');

// Constants
var PARAMETERS =
{
	address: 'https://payment.testdrive.klarna.com:443',
	eid: 123,
	sharedSecret: 'secret'
};

// Dependencies, etc
var xmlrpc = {};
var client = {}
var Klarna = proxyquire('../src-cov/klarna', { 'xmlrpc': xmlrpc });
var klarna = new Klarna(PARAMETERS);

// Mocks
xmlrpc.createSecureClient = function(address) { return client; };
xmlrpc.createClient = function(address) { return client; };
client.methodCall = function(method, parameters, callback)
{
	if (method === 'get_addresses')
	{
		if (parameters[2] === '410321-9202')
		{
			var data = [['Testperson-se', 'Approved', 'Stårgatan 1', '12345', 'Ankeborg', '209']];
			callback(undefined, data);
		}
		else if (parameters[2] === '002031-0132')
		{
			var data =
			[
				['Testcompany-se', 'Stårgatan 1', '12345', 'Ankeborg', '209'],
				['Testcompany-se', 'lillegatan 1', '12334', 'Ankeborg', '209']
			];
			callback(undefined, data);
		}
		else
		{
			var data =
			{
				code: '9113',
				faultString: 'Det har uppstått ett integrationsfel mellan butiken och Klarna. Kontakta Webbutiken för mer information eller välj ett annat sätt att betala.'
			};
			error(data, undefined);
		}
	}
};

describe('klarna.js', function()
{
	describe('#getAddresses(number, success, failure)', function ()
	{
		it('should return addresses for a person properly', function(done)
		{
			klarna.getAddresses('410321-9202', function(actual)
			{
				var expected =
				[
					{
						isCompany: false,
						firstName: 'Testperson-se',
						lastName: 'Approved',
						street: 'Stårgatan 1',
						zipCode: '12345',
						city: 'Ankeborg',
						country: '209'
					}
				];

				assert.deepEqual(expected, actual);
				done();
			}, function(error)
			{
				assert.fail('', '', 'Expected success, but got an error.');
				done();
			});
		});

		it('should return addresses for a company properly', function(done)
		{
			klarna.getAddresses('002031-0132', function(actual)
			{
				var expected =
				[
					{
						isCompany: true,
						companyName: 'Testcompany-se',
						street: 'Stårgatan 1',
						zipCode: '12345',
						city: 'Ankeborg',
						country: '209'
					},
					{
						isCompany: true,
						companyName: 'Testcompany-se',
						street: 'lillegatan 1',
						zipCode: '12334',
						city: 'Ankeborg',
						country: '209'
					}
				];

				assert.deepEqual(expected, actual);
				done();
			}, function(error)
			{
				assert.fail('', '', 'Expected success, but got an error.');
				done();
			});
		});
	});
});
