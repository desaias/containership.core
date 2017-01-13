'use strict';

const ContainershipCore = require('./containership-core');
const pkg = require('./package.json');
const opts = require('./options');

const _defaults = require('lodash.defaults');
const _has = require('lodash.has');

module.exports = function(options) {
    const core = new ContainershipCore({
        version: pkg.version
    });

    core.version = pkg.version;

    if(_has(options, 'scheduler')) {
        core.scheduler = options.scheduler;
        _defaults(opts, core.scheduler.options);
    } else {
        process.exit(1);
    }

    if(_has(options, 'api')) {
        core.api = options.api;
        _defaults(opts, core.api.options);
    } else {
        process.exit(1);
    }

    core.options = opts;
    return core;
};
