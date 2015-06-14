var path = require('path');

module.exports = function (grunt) {
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
                    rename: function(destBase, destPath){
                        return path.join(destBase, destPath.replace('.js', '.min.js'));
                    }
              }]
            }
        }
    });

    grunt.registerTask('dist', 'Creates distribution', ['jshint', 'uglify']);
};