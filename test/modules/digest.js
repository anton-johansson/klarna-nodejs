var expect = require('expect');
var digest = require('../../modules/digest');

describe('digest.js', function()
{
    describe('#digest(arguments)', function()
    {
        it('should return proper digested string', function()
        {
            var expected = 'apG3SvlfE1zYCcZ+ka0w5/FDGzA9cZwMjbGC+WkDjl8=';
            var actual = digest([ 123, '410321-9202', 'secret' ]);

            expect(actual).toEqual(expected);
        });

        it('should return proper digested string', function()
        {
            var expected = 'F19bBW5J+wPNRJ66hQdE0GpQEoSbUMk6o0+Mv+TpFaE=';
            var actual = digest([ 666, '002031-0132', 'some-secret-password' ]);

            expect(actual).toEqual(expected);
        });

        it('should throw error if arguments is not an array', function()
        {
            expect(function() { digest(undefined) }).toThrow("'arguments' must be an array");
            expect(function() { digest('hej')     }).toThrow("'arguments' must be an array");
            expect(function() { digest(123)       }).toThrow("'arguments' must be an array");
        });
    });
});
