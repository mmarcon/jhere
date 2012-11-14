.PHONY: dist

PLUGIN = jhere

deps:
	npm install

dist: hint plugin zepto summary

plugin:
	@./node_modules/.bin/uglifyjs -o dist/$(PLUGIN).min.js src/$(PLUGIN).js

zepto:
	@./node_modules/.bin/uglifyjs -o dist/zepto.adapter.min.js src/zepto.adapter.js

summary:
	@ls -nhl dist | awk '{print $$9,$$5}' | tail -n +2

hint:
	@./node_modules/.bin/jshint ./src

doc:
	@docco -t docs/docco.jst -o docs src/$(PLUGIN).js;mv docs/$(PLUGIN).html docs/docs.html