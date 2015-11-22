/*
Copyright (c) 2015 Massimiliano Marcon, http://marcon.me

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var path = require('path'),
    version = require('./package.json').version;

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        jshint: {
            all: ['Gruntfile.js', 'src/**/*.js'],
            options: {
                jshintrc: true
            }
        },
        uglify: {
            options: {
                report: 'min'
            },
            jhere: {
                files: {
                    './dist/jhere.min.js': ['./dist/jhere.js']
                }
            },
            adapters: {
                files: {
                    './dist/zepto.adapter.min.js': ['./src/zepto.adapter.js']
                }
            },
            extensions: {
                files: [{
                    expand: true,
                    cwd: 'src/extensions',
                    src: '**/*.js',
                    dest: 'dist/extensions',
                    rename: function(destBase, destPath) {
                        return path.join(destBase, destPath.replace('.js', '.min.js'));
                    }
                }]
            },
            webpack: {
                files: {
                    './out/jhere.min.js': ['./out/jhere.js']
                }
            }
        },

        webpack: {
            dist: {
                // webpack options
                entry: './src/jhere.js',
                output: {
                    path: 'dist/',
                    filename: 'jhere.js'
                },

                //devtool: 'eval',

                stats: {
                    // Configure the console output
                    colors: false,
                    modules: true,
                    reasons: true
                },

                module: {
                    loaders: [{
                        test: /\.js$/,
                        loader: 'babel-loader'
                    }]
                },

                resolve: {
                    extensions: ['', '.js']
                },

                failOnError: true
            },
            dev: {
                // webpack options
                entry: './src/jhere.js',
                output: {
                    path: 'out/',
                    filename: 'jhere.js'
                },

                devtool: 'eval',

                stats: {
                    // Configure the console output
                    colors: false,
                    modules: true,
                    reasons: true
                },

                module: {
                    loaders: [{
                        test: /\.js$/,
                        loader: 'babel-loader'
                    }]
                },

                resolve: {
                    extensions: ['', '.js']
                },

                failOnError: true,
                keepalive: true,
                watch: true
            }
        },
        doxdox: {
            jhere: {
                input: 'src/modules/core.js',
                output: 'out/docs/docs.md',
                config: {
                    title: 'jHERE',
                    description: 'Maps made easy',
                    layout: 'docs/markdown-template.hbs'
                }
            }
        },
        // make a zipfile
        compress: {
            main: {
                options: {
                    archive: 'dist/jhere.zip',
                    pretty: true
                },
                files: [
                    {expand: true, cwd: './dist/', src: ['*.js'], dest: 'jhere-' + version, filter: 'isFile'}
                ]
            }
        },
        replace: {
            examples: {
                src: ['examples/*.html'],
                dest: 'dist/examples/',
                replacements: [{
                    from: '../dist/jhere.min.js',
                    to: 'https://cdn.rawgit.com/mmarcon/jhere/jsla3/dist/jhere.min.js'
                },
                {
                    from: '../dist/jhere.js',
                    to: 'https://cdn.rawgit.com/mmarcon/jhere/jsla3/dist/jhere.min.js'
                },
                {
                    from: '../out/jhere.min.js',
                    to: 'https://cdn.rawgit.com/mmarcon/jhere/jsla3/dist/jhere.min.js'
                },
                {
                    from: '../out/jhere.js',
                    to: 'https://cdn.rawgit.com/mmarcon/jhere/jsla3/dist/jhere.min.js'
                }]
            }
        }
    });

    grunt.registerTask('default', 'Creates distribution', ['jshint', 'webpack:dist', 'uglify:jhere', 'compress', 'replace:examples']);
    grunt.registerTask('dev', 'Creates distribution', ['jshint', 'webpack:dev']);
    grunt.registerTask('docs', 'Generates documentation', ['doxdox']);
};
