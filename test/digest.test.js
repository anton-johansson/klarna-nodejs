var expect = require('expect');
var digest = require('../lib/digest');

describe('digest.js', function ()
{
	describe('#digest(arguments)', function ()
	{
		it('should return proper digested string', function()
		{
			expect(digest([123, '410321-9202', 'secret']))				.toEqual('apG3SvlfE1zYCcZ+ka0w5/FDGzA9cZwMjbGC+WkDjl8=');
			expect(digest([666, '002031-0132', 'some-secret-password'])).toEqual('F19bBW5J+wPNRJ66hQdE0GpQEoSbUMk6o0+Mv+TpFaE=');
			expect(digest([]))											.toEqual('47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=');
		});

		it('should throw error if arguments is not an array', function()
		{
			expect(function () { digest(undefined) })	.toThrow(/'arguments' must be an array/);
			expect(function () { digest('hej') })		.toThrow(/'arguments' must be an array/);
			expect(function () { digest(123) })			.toThrow(/'arguments' must be an array/);
			expect(function () { digest([]) })			.toNotThrow();
		});
	});
});
