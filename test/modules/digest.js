var digest = require('../../modules/digest');

var expected = 'apG3SvlfE1zYCcZ+ka0w5/FDGzA9cZwMjbGC+WkDjl8=';
var actual = digest([ 123, '410321-9202', 'secret' ]);

console.log(actual);

// assertEquals(expected, actual);

