/*
 * iwc-grunt
 * https://github.com/shadowmint/iwc-grunt
 *
 * Copyright (c) 2014 Douglas Linder
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

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp'],
            lib: ['tasks/**.js', 'tasks/**.d.ts', 'tasks/**.js.map']
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

    // Build the task libraries
    grunt.registerTask('default', ['ts:lib']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['ts:lib']);
};
