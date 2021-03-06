/*
* iwc-grunt
* https://github.com/shadowmint/grunt-iwc-grunt
*
* Copyright (c) 2014 doug
* Licensed under the MIT license.
*/
'use strict';
var fs = require('fs');
var glob = require('glob');
var path = require('path');
var mkdirp = require('mkdirp');
var handlebars = require('handlebars');
var beautify = require('js-beautify').js_beautify;
var validate = require('./lib/validate');
var actions = require('./lib/actions');

/* The build task to invoke */
function task(grunt) {
    grunt.registerMultiTask('iwc', 'Inline web component compiler.', function () {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            postfix: '.js',
            script: 'script.js',
            styles: 'styles.css',
            markup: 'markup.html',
            resources: null,
            output: null,
            template: null
        });

        // Process all segments
        this.files.forEach(function (f) {
            // Validate config
            validate.reset(grunt);
            if (!grunt.file.exists(f.dest)) {
                mkdirp.sync(f.dest);
                if (!validate.exists(f.dest, 'dest')) {
                    return false;
                }
            }

            // Process each folder
            f.src.forEach(function (target) {
                // Validate file target
                if (!validate.exists(target, 'src')) {
                    return false;
                }
                if (!validate.is_dir(target)) {
                    return false;
                }

                // Setup actions
                actions.grunt = grunt;
                actions.options = options;
                actions.target = target;
                actions.dest = f.dest;

                // Apply the template if there is one
                if (options.template) {
                    actions.set_template(options.template);
                }

                // Generate output string
                var output_file = actions.output(options.output);

                // Validate the components of this component exist
                var parts = actions.parts();
                if (!validate.exists(parts.script, 'options.scripts in ' + target)) {
                    return false;
                }
                if (!validate.exists(parts.script, 'options.styles in ' + target)) {
                    return false;
                }
                if (!validate.exists(parts.script, 'options.markup in ' + target)) {
                    return false;
                }

                // Generate a component from the parts
                var output = actions.combine(parts);

                // Generate output file
                output = beautify(output, { indent_size: 2 });
                fs.writeFileSync(output_file, output);

                return true;
            });

            if (validate.failed) {
                throw Error('iwc-grunt: errors occurred');
            }
        });
    });
}
module.exports = task;
//# sourceMappingURL=iwc.js.map
