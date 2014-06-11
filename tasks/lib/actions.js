/*
* iwc-grunt
* https://github.com/shadowmint/grunt-iwc-grunt
*
* Copyright (c) 2014 doug
* Licensed under the MIT license.
*/
'use strict';
var path = require('path');
var fs = require('fs');
var handlebars = require('handlebars');
var glob = require('glob');

/* Internal grunt state cache */
exports.grunt = null;

/* Config */
exports.options;

/* Current build target */
exports.target;

/* Current output target folder */
exports.dest;

/* Name template */
var output_template = template('output_file.html');

/* The output content template */
var output_content_template = template('output_content.html');

/* Load and compile a template from the templates folder */
function template(name) {
    var template = path.resolve(__dirname, 'templates', name);
    var raw = fs.readFileSync(template, 'utf8');
    return handlebars.compile(raw);
}

/* Set the template to use */
function set_template(path) {
    var tpath = process.cwd() + '/' + path;
    try  {
        var raw = fs.readFileSync(tpath, 'utf8');
        output_content_template = handlebars.compile(raw);
    } catch (e) {
        exports.grunt.warn('Invalid template: ' + tpath);
    }
}
exports.set_template = set_template;

/* Get the output folder for a specific source */
function output(name) {
    if (typeof name === "undefined") { name = null; }
    var used_name = name ? name : path.basename(exports.target);
    return output_template({
        folder: exports.dest,
        postfix: exports.options.postfix,
        name: used_name
    });
}
exports.output = output;

/* Get a list of the parts in the target folder */
function parts() {
    var rtn = {
        script: output_template({ folder: exports.target, name: exports.options.script, postfix: '' }),
        styles: output_template({ folder: exports.target, name: exports.options.styles, postfix: '' }),
        markup: output_template({ folder: exports.target, name: exports.options.markup, postfix: '' }),
        resource_map: resources(),
        resources: ''
    };
    return rtn;
}
exports.parts = parts;

/* Combine elements */
function combine(parts) {
    parts.script = fs.readFileSync(parts.script, 'utf8');
    parts.styles = JSON.stringify(fs.readFileSync(parts.styles, 'utf8'));
    parts.markup = JSON.stringify(fs.readFileSync(parts.markup, 'utf8'));
    for (var key in parts.resource_map) {
        parts.resource_map[key] = fs.readFileSync(parts.resource_map[key], 'utf8');
    }
    parts.resources = JSON.stringify(parts.resource_map);
    return output_content_template(parts);
}
exports.combine = combine;

/* Recursively walk the directories and invoke a callback on each target */
function resources() {
    if (exports.options.resources) {
        var items = [];
        var tmp = exports.options.resources;
        if (typeof tmp == 'string') {
            exports.options.resources = [tmp];
        }
        for (var i = 0; i < exports.options.resources.length; ++i) {
            var file = exports.target + '/' + exports.options.resources[i];
            items = items.concat(glob.sync(file));
        }
        var rtn = {};
        for (var i = 0; i < items.length; ++i) {
            var key = path.basename(items[i]);
            if (key != exports.options.script && key != exports.options.styles && key != exports.options.markup) {
                rtn[key] = items[i];
            }
        }
        return rtn;
    }
    return {};
}


//# sourceMappingURL=actions.js.map
