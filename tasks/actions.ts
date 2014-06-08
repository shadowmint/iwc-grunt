/*
 * iwc-grunt
 * https://github.com/shadowmint/grunt-iwc-grunt
 *
 * Copyright (c) 2014 doug
 * Licensed under the MIT license.
 */

'use strict';

declare var require;
declare var __dirname;
declare var process;

var path:any = require('path');
var fs:any = require('fs');
var handlebars:any = require('handlebars');

/* Internal grunt state cache */
export var grunt:any = null;

/* Config */
export var options:IwcOptions;

/* Current build target */
export var target:string;

/* Current output target folder */
export var dest:string;

/* Name template */
var output_template = template('output_file.html');

/* The output content template */
var output_content_template = template('output_content.html');

/* Load and compile a template from the templates folder */
function template(name):any {
  var template = path.resolve(__dirname, 'templates', name);
  var raw = fs.readFileSync(template, 'utf8');
  return handlebars.compile(raw);
}

/* Set the template to use */
export function set_template(path:string):void {
  var tpath = process.cwd() + '/' + path;
  try {
    var raw = fs.readFileSync(tpath, 'utf8');
    output_content_template = handlebars.compile(raw);
  }
  catch (e) {
    grunt.warn('Invalid template: ' + tpath);
  }
}

/* Get the output folder for a specific source */
export function output():string {
  return output_template({
    folder: dest,
    postfix: options.postfix,
    name: path.basename(target)
  });
}

/* Get a list of the parts in the target folder */
export function parts():IwcParts {
  var rtn = {
    script: output_template({folder: target, name: options.script, postfix: ''}),
    styles: output_template({folder: target, name: options.styles, postfix: ''}),
    markup: output_template({folder: target, name: options.markup, postfix: ''})
  }
  return rtn;
}

/* Combine elements */
export function combine(parts:IwcParts):string {
  parts.script = fs.readFileSync(parts.script, 'utf8');
  parts.styles = JSON.stringify(fs.readFileSync(parts.styles, 'utf8'));
  parts.markup = JSON.stringify(fs.readFileSync(parts.markup, 'utf8'));
  return output_content_template(parts);
}

/* Set of parts */
export interface IwcParts {
  script:string;
  styles:string;
  markup:string;
}

/* Options for these tasks */
export interface IwcOptions {
  script:string;
  styles:string;
  markup:string;
  postfix:string;
}
