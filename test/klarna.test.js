var proxyquire = require('proxyquire');
var assert = require('assert');
var expect = require('expect');

// Constants
const PARAMETERS =
{
	address: 'https://payment.testdrive.klarna.com:443',
	eid: 123,
	sharedSecret: 'secret',
	clientIP: '127.0.0.1'
};

// Dependencies, etc
var xmlrpc = {};
var client = {}
var Klarna = proxyquire('../lib/klarna', { 'xmlrpc': xmlrpc });
var klarna;

before(function()
{
	klarna = new Klarna(PARAMETERS)
});

// Mocks
xmlrpc.createSecureClient = function(address) { return client; };
xmlrpc.createClient = function(address) { return client; };
client.methodCall = function(method, parameters, callback)
{
	if (method === 'get_addresses')
	{
		if (parameters[2] === '410321-9202' && parameters[7] === '127.0.0.1')
		{
			var data = [['Testperson-se', 'Approved', 'Stårgatan 1', '12345', 'Ankeborg', '209']];
			callback(undefined, data);
		}
		else if (parameters[2] === '002031-0132' && parameters[7] === '127.0.0.1')
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
			callback(data);
		}
	}
};

describe('klarna.js', function()
{
	describe('constructor', function()
	{
		it('should throw an error if eid is invalid', function()
		{
			expect(function() { new Klarna({ eid: -1, sharedSecret: 'abc123', address: 'https://payment.klarna.com:443' }) }).toThrow(/'eid' must be a positive number/);
			expect(function() { new Klarna({ eid: 1, sharedSecret: 'abc123', address: 'https://payment.klarna.com:443' }) }).toNotThrow();
		});

		it('should throw an error if the shared secret is invalid', function()
		{
			expect(function() { new Klarna({ eid: 1, sharedSecret: '', address: 'https://payment.klarna.com:443' }) }).toThrow(/'sharedSecret' must be a non-empty string/);
			expect(function() { new Klarna({ eid: 1, sharedSecret: 'abc123', address: 'https://payment.klarna.com:443' }) }).toNotThrow();
		});

		it('should throw an error if the address is invalid', function()
		{
			expect(function() { new Klarna({ eid: 1, sharedSecret: 'abc123', address: 'abc123' }) }).toThrow(/'address' must be a proper URL/);
			expect(function() { new Klarna({ eid: 1, sharedSecret: 'abc123', address: 'https://payment.klarna.com:443' }) }).toNotThrow();
		});
	});

	describe('#getAddresses(number, callback)', function ()
	{
		it('should throw error if clientIP is invalid', function()
		{
			var parameters =
			{
				address: 'http://payment.testdrive.klarna.com:80',
				eid: 123,
				sharedSecret: 'secret',
				clientIP: 'invalid-address'
			};

			var klarna = new Klarna(parameters);
			expect(function() { klarna.getAddresses('410321-9202', function(){}); }).toThrow(/'clientIP' is not a valid IP-address/);
		});

		it('should return addresses for a person properly', function(done)
		{
			klarna.getAddresses('410321-9202', function(error, addresses)
			{
				if (error)
				{
					assert.fail('', '', 'Expected success, but got an error.');
					done();
				}

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

				assert.deepEqual(expected, addresses);
				done();
			});
		});

		it('should return addresses for a company properly', function(done)
		{
			klarna.getAddresses('002031-0132', function(error, addresses)
			{
				if (error)
				{
					assert.fail('', '', 'Expected success, but got an error.');
					done();
				}

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

				assert.deepEqual(expected, addresses);
				done();
			});
		});

		it('should return error properly if XMLRPC error occurs', function(done)
		{
			klarna.getAddresses('123', function(error, addresses)
			{
				if (addresses)
				{
					assert.fail('', '', 'Expected failure, but got success.');
					done();
				}

				var expected =
				{
					code: '9113',
					faultString: 'Det har uppstått ett integrationsfel mellan butiken och Klarna. Kontakta Webbutiken för mer information eller välj ett annat sätt att betala.'
				};

				assert.deepEqual(expected, error);
				done();
			});
		});

		it('should work properly using http in addition to https', function(done)
		{
			var parameters =
			{
				address: 'http://payment.testdrive.klarna.com:80',
				eid: 123,
				sharedSecret: 'secret',
				clientIP: '127.0.0.1'
			};

			klarna = new Klarna(parameters);
			klarna.getAddresses('410321-9202', function(error, addresses)
			{
				if (error)
				{
					assert.fail('', '', 'Expected success, but got an error.');
					done();
				}

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

				assert.deepEqual(expected, addresses);
				done();
			});
		});
	});
});
