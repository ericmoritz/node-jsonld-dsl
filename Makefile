.PHONY: compile test doc

all: test doc

doc: 
	./node_modules/.bin/docco test/example.test.js

test:
	npm test


