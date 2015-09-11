var expect = require('expect');
var digest = require('../lib/digest');

describe('digest.js', function ()
{
	describe('#digest(arguments)', function ()
	{
		it('should return proper digested string', function (done)
		{
			assertDigest([123, '410321-9202', 'secret'], 'apG3SvlfE1zYCcZ+ka0w5/FDGzA9cZwMjbGC+WkDjl8=');
			assertDigest([666, '002031-0132', 'some-secret-password'], 'F19bBW5J+wPNRJ66hQdE0GpQEoSbUMk6o0+Mv+TpFaE=');
			assertDigest([], '47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=');
			done();
		});

		it('should throw error if arguments is not an array', function (done)
		{
			expect(function () { digest(undefined)		}).toThrow(/'arguments' must be an array/);
			expect(function () { digest('hej')			}).toThrow(/'arguments' must be an array/);
			expect(function () { digest(123)			}).toThrow(/'arguments' must be an array/);
			expect(function () { digest([])				}).toNotThrow();
			done();
		});
	});
});

/**
 * Helper functions
 */

function assertDigest(arguments, expected)
{
	var actual = digest(arguments);
	expect(actual).toEqual(expected);
}
