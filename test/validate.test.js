var expect = require('expect');
var validate = require('../lib/validate');

describe('validate.js', function ()
{
	describe('#eid(eid)', function ()
	{
		it('should consider positive numbers as OK', function (done)
		{
			expect(validate.eid(1)).toEqual(true);
			expect(validate.eid(123)).toEqual(true);
			expect(validate.eid(999999999)).toEqual(true);
			expect(validate.eid(0)).toEqual(false);
			expect(validate.eid(-1)).toEqual(false);
			expect(validate.eid('hello world')).toEqual(false);
			expect(validate.eid('12345')).toEqual(true);
			done();
		});
	});
});
