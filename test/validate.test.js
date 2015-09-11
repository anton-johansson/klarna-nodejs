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

	describe('#address(address)', function ()
	{
		it('should only consider IP-addresses as OK', function (done)
		{
			expect(validate.address('http://testdrive.payment.klarna.com:80')).toEqual(true);
			expect(validate.address('https://payment.klarna.com:443')).toEqual(true);
			expect(validate.address('http://www.google.se')).toEqual(true);
			expect(validate.address('payment.klarna.com')).toEqual(false);
			expect(validate.address('')).toEqual(false);
			expect(validate.address(123)).toEqual(false);
			expect(validate.address([])).toEqual(false);
			done();
		});
	});
});
