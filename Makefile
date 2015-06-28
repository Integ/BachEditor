TESTS = test/*.js
REPORTER = spec
TIMEOUT = 10000
MOCHA_OPTS = 

test:
	@NODE_ENV=test mocha \
			--reporter $(REPORTER) \
			--timeout $(TIMEOUT) \
			$(MOCHA_OPTS) \
			$(TEST)

test-cov:
	@NODE_ENV=test istanbul cover _mocha \
			$(TEST)

.PHONY:test
clean:
	rm -rf .*.*.sw* 
