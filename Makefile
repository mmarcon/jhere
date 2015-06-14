.PHONY: dist test

PLUGIN = jhere
TESTED_CODE = test/lib/jhere.js
INJECTORS = $(shell cat test/lib/injectors.js | tr -d ' ')
RUNNER = test/SpecRunner.html

deps:
	@npm install

dist:
	@grunt dist

plugin:
	@grunt jshint uglify:jhere

adapters:
	@grunt jshint uglify:adapters

extensions:
	grunt uglify:extensions

summary:
	@ls -nhl dist | grep -v ^d | awk '{print $$9,$$5}' | tail -n +2; \
	ls -nhl dist/extensions | grep -v ^d | awk '{print $$9,$$5}' | tail -n +2

hint:
	@grunt jshint

doc:
	@docco -t docs/docco.new.jst -o docs src/$(PLUGIN).js;mv docs/$(PLUGIN).html web/docs.html;

website: doc
	@./build-scripts/update-website.sh "$(COMMENT)"

test: deps
	@sed 's/\/\*\*\*_\*\*\*\//$(INJECTORS)/g' src/$(PLUGIN).js > $(TESTED_CODE); \
	command -v phantomjs >/dev/null 2>&1 || { echo >&2 "PhantomJS not installed.  Run the tests from the browser."; exit 0; }; \
	./node_modules/.bin/phantom-jasmine $(RUNNER)
