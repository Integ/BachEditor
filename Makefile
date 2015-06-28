TESTS = test/*.js
REPORTER = spec
TIMEOUT = 10000
MOCHA_OPTS = 

test:
	@NODE_ENV=test ./node_modules/mocha-phantomjs/bin/mocha-phantomjs \
			--reporter $(REPORTER) \
			--timeout $(TIMEOUT) \
			$(MOCHA_OPTS) \
			$(TEST)

.PHONY:test
clean:
	rm -rf .*.*.sw* 
