/*
 * iwc-grunt
 * https://github.com/shadowmint/grunt-iwc-grunt
 *
 * Copyright (c) 2014 doug
 * Licensed under the MIT license.
 */

'use strict';

/* Any errors? */
export var failed:boolean = false;

/* Internal grunt state cache */
export var grunt:any = null;

/* Console logger */
export function warn(msg:string):boolean {
    grunt.log.warn('iwc-grunt: ' + msg);
    return false;
}

/* Reset error state */
export function reset(g:any):void {
    grunt = g;
    failed = false;
}

/* Check a file exists */
export function exists(target:any, param:any):boolean {
    try {
        if (!grunt.file.exists(target)) {
            failed = true;
            return warn('Missing file for ' + param + ': ' + target);
        }
    }
    catch (e) {
        failed = true;
        return warn('Invalid path for ' + param + ': ' + target);
    }
    return true;
}

/* Check if a target is a directory for not */
export function is_dir(target:any):boolean {
    if (!grunt.file.isDir(target)) {
        failed = true;
        return warn('Invalid path: ' + target + ' is not a directory');
    }
    return true;
}
