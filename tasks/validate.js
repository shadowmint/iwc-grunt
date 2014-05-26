/*
* iwc-grunt
* https://github.com/shadowmint/grunt-iwc-grunt
*
* Copyright (c) 2014 doug
* Licensed under the MIT license.
*/
'use strict';
/* Any errors? */
exports.failed = false;

/* Internal grunt state cache */
exports.grunt = null;

/* Console logger */
function warn(msg) {
    exports.grunt.log.warn('iwc-grunt: ' + msg);
    return false;
}
exports.warn = warn;

/* Reset error state */
function reset(g) {
    exports.grunt = g;
    exports.failed = false;
}
exports.reset = reset;

/* Check a file exists */
function exists(target, param) {
    try  {
        if (!exports.grunt.file.exists(target)) {
            exports.failed = true;
            return exports.warn('Missing file for ' + param + ': ' + target);
        }
    } catch (e) {
        exports.failed = true;
        return exports.warn('Invalid path for ' + param + ': ' + target);
    }
    return true;
}
exports.exists = exists;

/* Check if a target is a directory for not */
function is_dir(target) {
    if (!exports.grunt.file.isDir(target)) {
        exports.failed = true;
        return exports.warn('Invalid path: ' + target + ' is not a directory');
    }
    return true;
}
exports.is_dir = is_dir;
//# sourceMappingURL=validate.js.map
