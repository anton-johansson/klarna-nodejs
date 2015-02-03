var assert = require('assert');
var digest = require('../../modules/digest');

describe('digest.js', function()
{
    describe('#digest(arguments)', function()
    {
        it('should return proper digested string', function()
        {
            var expected = 'apG3SvlfE1zYCcZ+ka0w5/FDGzA9cZwMjbGC+WkDjl8=';
            var actual = digest([ 123, '410321-9202', 'secret' ]);

            assert.equal(expected, actual);
        });

        it('should throw error if arguments is not an array', function()
        {
            assert.equal(false, true);
        });
    });
});
