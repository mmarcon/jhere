.PHONY: dist

PLUGIN = jhere

deps:
	npm install

dist: hint plugin zepto extensions summary

plugin:
	@./node_modules/.bin/uglifyjs -nc -o dist/$(PLUGIN).min.js src/$(PLUGIN).js

zepto:
	@./node_modules/.bin/uglifyjs -nc -o dist/zepto.adapter.min.js src/zepto.adapter.js

extensions:
	@./build-scripts/build-extensions.sh

summary:
	@ls -nhl dist | grep -v ^d | awk '{print $$9,$$5}' | tail -n +2; \
	ls -nhl dist/extensions | grep -v ^d | awk '{print $$9,$$5}' | tail -n +2

hint:
	@./node_modules/.bin/jshint ./src

doc:
	@docco -t docs/docco.jst -o docs src/$(PLUGIN).js;mv docs/$(PLUGIN).html docs/docs.html; \
	[[ ${JHERE_GHPAGES} ]] && cp docs/docs.html ${JHERE_GHPAGES} && cp src/jhere.js ${JHERE_GHPAGES}/js