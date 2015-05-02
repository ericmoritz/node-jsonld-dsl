.PHONY: compile test doc

all: test docs

doc: 
	npm doc
test:
	npm test


