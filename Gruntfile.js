var path = require('path');

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
                    './dist/jhere.min.js': ['./src/jhere.js']
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
                    path: 'out/',
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
        }
    });

    grunt.registerTask('default', 'Creates distribution', ['jshint', 'webpack:dist', 'uglify:webpack']);
    grunt.registerTask('dev', 'Creates distribution', ['jshint', 'webpack:dev']);
};
