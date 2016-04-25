"use strict";

var proxyquire = require('proxyquire');
var assert = require('assert');
var expect = require('expect');

// Constants
var PARAMETERS =
{
	url: 'https://payment.testdrive.klarna.com:443',
	eid: 123,
	sharedSecret: 'secret'
};

// Dependencies, etc
var xmlrpc = {};
var client = {};
var Klarna = proxyquire('../lib/klarna', { 'xmlrpc': xmlrpc });
var klarna;

before(function()
{
	klarna = new Klarna(PARAMETERS);
});

// Mocks
xmlrpc.createSecureClient = function(url) { return client; };
xmlrpc.createClient = function(url) { return client; };
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
	else if (method === 'cancel_reservation')
	{
		if (parameters[2] === '123') {
			var data = 'OK';
			callback(undefined, data);
		}
		else if (parameters[2] === '666') {
		{
			var data =
			{
				code: '9109',
				faultString: 'We were not able to find the reservation you are trying to use. Please make sure you are using a correct reservation number and try again.' };
			};
			callback(data, undefined);
		}
		else
		{
			var data =
			{
				code: '9113',
				faultString: 'Det har uppstått ett integrationsfel mellan butiken och Klarna. Kontakta Webbutiken för mer information eller välj ett annat sätt att betala.'
			};
			callback(data, undefined);
		}

	}
};

describe('klarna.js', function()
{
	describe('constructor', function()
	{
		it('should throw an error if eid is invalid', function()
		{
			expect(function() { new Klarna({ eid: -1, sharedSecret: 'abc123', url: 'https://payment.klarna.com:443' }) }).toThrow(/'eid' must be a positive number/);
			expect(function() { new Klarna({ eid: 1, sharedSecret: 'abc123', url: 'https://payment.klarna.com:443' }) }).toNotThrow();
		});

		it('should throw an error if the shared secret is invalid', function()
		{
			expect(function() { new Klarna({ eid: 1, sharedSecret: '', url: 'https://payment.klarna.com:443' }) }).toThrow(/'sharedSecret' must be a non-empty string/);
			expect(function() { new Klarna({ eid: 1, sharedSecret: 'abc123', url: 'https://payment.klarna.com:443' }) }).toNotThrow();
		});

		it('should throw an error if the url is invalid', function()
		{
			expect(function() { new Klarna({ eid: 1, sharedSecret: 'abc123', url: 'abc123' }) }).toThrow(/'url' must be a proper URL/);
			expect(function() { new Klarna({ eid: 1, sharedSecret: 'abc123', url: 'https://payment.klarna.com:443' }) }).toNotThrow();
		});

	});

	describe('#cancelReservation(rno, callback)', function ()
	{
		it('should throw error if rno is invalid', function()
		{
			var parameters =
			{
				url: 'http://payment.testdrive.klarna.com:80',
				eid: 123,
				sharedSecret: 'secret'
			};

			var klarna = new Klarna(parameters);
			expect(klarna.cancelReservation).withContext(klarna).withArgs('invalid-rno', function(){}).toThrow(/'rno' is not a valid reservation number/);
		});

		it('should return error properly if XMLRPC error occurs', function(done)
		{
			klarna.cancelReservation('888', function(error, result)
			{
				if (result)
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

		it('should return OK if the call succeeds', function(done)
		{
			klarna.cancelReservation('123', function(error, result)
			{
				if (error)
				{
					assert.fail('', '', 'Expected success, but got failure.');
					done();
				}

				var expected = 'OK'

				assert(result == expected);
				done();
			});
		});

		it('should handle "not found" error properly', function(done)
		{
			klarna.cancelReservation('666', function(error, result)
			{
				if (result)
				{
					assert.fail('', '', 'Expected failure, but got success.');
					done();
				}

				var expected =
				{
					code: '9109',
					faultString: 'We were not able to find the reservation you are trying to use. Please make sure you are using a correct reservation number and try again.'
				};

				assert.deepEqual(expected, error);
				done();
			});
		});

	});

	describe('#getAddresses(clientIP, number, callback)', function ()
	{
		it('should throw error if clientIP is invalid', function()
		{
			var parameters =
			{
				url: 'http://payment.testdrive.klarna.com:80',
				eid: 123,
				sharedSecret: 'secret'
			};

			var klarna = new Klarna(parameters);
			expect(klarna.getAddresses).withContext(klarna).withArgs('invalid-IP', 'SE', '410321-9202', function(){}).toThrow(/'clientIP' is not a valid IP-address/);
		});

		it('should throw error if the pno is invalid', function()
		{
			expect(klarna.getAddresses).withContext(klarna).withArgs('127.0.0.1', 'SE', '', function(){}).toThrow(/'pno' is not valid/);
		});

		it('should return addresses for a person properly', function(done)
		{
			klarna.getAddresses('127.0.0.1', 'SE', '410321-9202', function(error, addresses)
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
			klarna.getAddresses('127.0.0.1', 'SE', '002031-0132', function(error, addresses)
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
			klarna.getAddresses('127.0.0.1', 'SE', '123', function(error, addresses)
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
				url: 'http://payment.testdrive.klarna.com:80',
				eid: 123,
				sharedSecret: 'secret'
			};

			klarna = new Klarna(parameters);
			klarna.getAddresses('127.0.0.1', 'SE', '410321-9202', function(error, addresses)
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
