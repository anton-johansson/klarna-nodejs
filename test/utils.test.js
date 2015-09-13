"use strict";

var expect = require('expect');
var utils = require('../lib/utils');

describe('utils.js', function ()
{
	describe('#country(countryCode)', function()
	{
		it('should return itself if a proper country is passed in', function()
		{
			expect(utils.country( 15)).toEqual( 15);
			expect(utils.country( 59)).toEqual( 59);
			expect(utils.country( 73)).toEqual( 73);
			expect(utils.country( 81)).toEqual( 81);
			expect(utils.country(154)).toEqual(154);
			expect(utils.country(164)).toEqual(164);
			expect(utils.country(209)).toEqual(209);
		});

		it('should return proper countries from their country codes', function()
		{
			expect(utils.country('AT')) .toEqual( 15);
			expect(utils.country('AUT')).toEqual( 15);
			expect(utils.country('DK')) .toEqual( 59);
			expect(utils.country('DNK')).toEqual( 59);
			expect(utils.country('FI')) .toEqual( 73);
			expect(utils.country('FIN')).toEqual( 73);
			expect(utils.country('DE')) .toEqual( 81);
			expect(utils.country('DEU')).toEqual( 81);
			expect(utils.country('NL')) .toEqual(154);
			expect(utils.country('NLD')).toEqual(154);
			expect(utils.country('NO')) .toEqual(164);
			expect(utils.country('NOR')).toEqual(164);
			expect(utils.country('SE')) .toEqual(209);
			expect(utils.country('SWE')).toEqual(209);
		});

		it('should throw error if an invalid country is given', function()
		{
			expect(utils.country).withArgs('USA').toThrow(/Invalid country/);
			expect(utils.country).withArgs(999).toThrow(/Invalid country/);
			expect(utils.country).withArgs([]).toThrow(/Invalid country/);
			expect(utils.country).withArgs({}).toThrow(/Invalid country/);
			expect(utils.country).toThrow(/Invalid country/);
		});
	});
});
