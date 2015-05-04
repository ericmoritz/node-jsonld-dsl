.PHONY: compile test doc

SRC = $(wildcard src/*.js)
LIB = $(SRC:src/%.js=lib/%.js)

all: test lib doc


lib: $(LIB)
lib/%.js: src/%.js
	mkdir -p $(@D)
	babel $< -o $@




doc: 
	./node_modules/.bin/docco test/example.test.js
	mv docs/example.test.html docs/index.html

test:
	npm test

deploy:
	git -C docs push origin
	git push origin master
