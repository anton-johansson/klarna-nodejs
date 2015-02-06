test:
	./node_modules/.bin/jscoverage src src-cov
	./node_modules/.bin/mocha test/**.test.js -r jscoverage

cover:
	./node_modules/.bin/jscoverage src src-cov
	./node_modules/.bin/mocha test/**.test.js -R html-cov > coverage.html

.PHONY: test
