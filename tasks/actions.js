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

/* Get the output folder for a specific source */
function output() {
    return output_template({
        folder: exports.dest,
        postfix: exports.options.postfix,
        name: path.basename(exports.target)
    });
}
exports.output = output;

/* Get a list of the parts in the target folder */
function parts() {
    var rtn = {
        script: output_template({ folder: exports.target, name: exports.options.script, postfix: '' }),
        styles: output_template({ folder: exports.target, name: exports.options.styles, postfix: '' }),
        markup: output_template({ folder: exports.target, name: exports.options.markup, postfix: '' })
    };
    return rtn;
}
exports.parts = parts;

/* Combine elements */
function combine(parts) {
    parts.script = fs.readFileSync(parts.script, 'utf8');
    parts.styles = JSON.stringify(fs.readFileSync(parts.styles, 'utf8'));
    parts.markup = JSON.stringify(fs.readFileSync(parts.markup, 'utf8'));
    return output_content_template(parts);
}
exports.combine = combine;


//# sourceMappingURL=actions.js.map