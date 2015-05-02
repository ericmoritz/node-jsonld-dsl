.PHONY: compile test doc

all: test doc

doc: 
	./node_modules/.bin/docco test/example.test.js
	mv docs/example.test.html docs/index.html

test:
	npm test

deploy:
	git -C docs push origin
	git push origin master
