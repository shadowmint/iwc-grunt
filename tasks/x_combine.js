/*
* grunt-x-combine
* https://github.com/shadowmint/grunt-x-combine
*
* Copyright (c) 2014 doug
* Licensed under the MIT license.
*/
'use strict';
var fs = require('fs');
var glob = require('glob');
var path = require('path');
var handlebars = require('handlebars');

// Helpers
var validate;
(function (validate) {
    /* Check a file exists */
    function exists(grunt, target) {
        if (!grunt.file.exists(target)) {
            grunt.log.warn('Invalid path: ' + target);
            return false;
        }
        return true;
    }
    validate.exists = exists;

    /* Check if a target is a directory for not */
    function is_dir(grunt, target) {
        if (!grunt.file.isDir(target)) {
            grunt.log.warn('Invalid path: ' + target + ' is not a directory');
            return false;
        }
        return true;
    }
    validate.is_dir = is_dir;
})(validate || (validate = {}));

function task(grunt) {
    grunt.registerMultiTask('x_combine', 'A template based grunt file combiner.', function () {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            prefix: '',
            postfix: ''
        });

        // Iterate over all specified file groups.
        this.files.forEach(function (f) {
            // Validate config
            if (!validate.exists(grunt, f.dest)) {
                return false;
            }
            if (!validate.exists(grunt, f.template)) {
                return false;
            }

            // Compile template
            var source = grunt.file.read(f.template);
            var template = handlebars.compile(source);

            f.src.forEach(function (target) {
                // Validate file target
                if (!validate.exists(grunt, target)) {
                    return false;
                }
                if (!validate.is_dir(grunt, target)) {
                    return false;
                }

                // Find all subtarget in the directory
                var matches = glob.sync(target + "/*", { sync: true });
                var keys = matches.map(function (x) {
                    return path.basename(x).replace(/\./g, '_');
                });

                // Generate an output name
                var fragments = target.split('/');
                var output_target = fragments[fragments.length - 1];
                var output_path = f.dest + '/' + options.prefix + output_target + options.postfix;
                var output_name = options.prefix + output_target;
                var output_id = output_name.replace('-', '_');

                // Generate template dictionary
                var data = {
                    prefix: options.prefix,
                    postfix: options.postfix,
                    id: output_id,
                    name: output_name,
                    path: output_path
                };
                for (var i = 0; i < matches.length; ++i) {
                    var tmp = grunt.file.read(matches[i]).trim();
                    var tmptmp = handlebars.compile(tmp);
                    data[keys[i]] = tmptmp(data);
                }

                // Generate an output file from the template
                var output_raw = template(data);
                grunt.file.write(output_path, output_raw);

                return true;
            });

            // grunt.file.write(f.dest, src);
            // Print a success message.
            //grunt.log.writeln('File "' + f.dest + '" created.');
            return true;
        });
    });
}
module.exports = task;
//# sourceMappingURL=x_combine.js.map
