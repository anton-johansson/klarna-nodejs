"use strict";

var expect = require('expect');
var validate = require('../lib/validate');

describe('validate.js', function ()
{
	describe('#eid(eid)', function ()
	{
		it('should consider positive numbers as OK', function()
		{
			expect(validate.eid(1)).toEqual(true);
			expect(validate.eid(123)).toEqual(true);
			expect(validate.eid(999999999)).toEqual(true);
			expect(validate.eid(0)).toEqual(false);
			expect(validate.eid(-1)).toEqual(false);
			expect(validate.eid('hello world')).toEqual(false);
			expect(validate.eid('12345')).toEqual(true);
		});
	});

	describe('#sharedSecret(sharedSecret)', function ()
	{
		it('should consider non-empty strings as OK', function()
		{
			expect(validate.sharedSecret('')).toEqual(false);
			expect(validate.sharedSecret(undefined)).toEqual(false);
			expect(validate.sharedSecret([])).toEqual(false);
			expect(validate.sharedSecret('abc123')).toEqual(true);
		});
	});

	describe('#address(address)', function ()
	{
		it('should only consider proper URLs as OK', function()
		{
			expect(validate.address('http://testdrive.payment.klarna.com:80')).toEqual(true);
			expect(validate.address('https://payment.klarna.com:443')).toEqual(true);
			expect(validate.address('http://www.google.se')).toEqual(true);
			expect(validate.address('payment.klarna.com')).toEqual(false);
			expect(validate.address('')).toEqual(false);
			expect(validate.address(123)).toEqual(false);
			expect(validate.address([])).toEqual(false);
		});
	});

	describe('#clientIP(clientIP)', function ()
	{
		it('should only consider IP-addresses as OK', function()
		{
			expect(validate.clientIP('8.8.8.8')).toEqual(true);
			expect(validate.clientIP('127.0.0.1')).toEqual(true);
			expect(validate.clientIP('3ffe:1900:4545:3:200:f8ff:fe21:67cf')).toEqual(true);
			expect(validate.clientIP('1.2.3')).toEqual(false);
			expect(validate.clientIP('')).toEqual(false);
			expect(validate.clientIP(123)).toEqual(false);
			expect(validate.clientIP([])).toEqual(false);
			expect(validate.clientIP({})).toEqual(false);
		});
	});

	describe('#number(number)', function ()
	{
		it('should consider non-empty strings as OK', function()
		{
			expect(validate.number('')).toEqual(false);
			expect(validate.number(undefined)).toEqual(false);
			expect(validate.number([])).toEqual(false);
			expect(validate.number('abc123')).toEqual(true);
		});
	});
});
