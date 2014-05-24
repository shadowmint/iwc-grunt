/*
 * grunt-x-combine
 * https://github.com/shadowmint/grunt-x-combine
 *
 * Copyright (c) 2014 doug
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    // Tasks
    require('matchdep').filterAll('grunt-*').forEach(function (x) {
        console.log("Autoload: " + x);
        grunt.loadNpmTasks(x);
    });

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp']
        },

        // Configuration to be run (and then tested).
        x_combine: {
            default_options: {
                options: {
                },
                files: {
                    'tmp/default_options': ['test/fixtures/testing', 'test/fixtures/123']
                }
            },
            custom_options: {
                options: {
                    separator: ': ',
                    punctuation: ' !!!'
                },
                files: {
                    'tmp/custom_options': ['test/fixtures/testing', 'test/fixtures/123']
                }
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        },

        // Build
        ts: {
            lib: {
                src: ['tasks/**/*.ts'],
                outDir: 'tasks/',
                options: {
                    module: 'commonjs',
                    target: 'es3',
                    sourceMaps: true,
                    declaration: true,
                    removeComments: false
                }
            }
        },

        // Watch
        watch: {
            lib: {
                files: ['tasks/**/*.ts'],
                tasks: ['ts:lib'],
                options: {
                    spawn: false
                }
            }
        }
    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'x_combine', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['ts:lib', 'jshint', 'test']);
};
