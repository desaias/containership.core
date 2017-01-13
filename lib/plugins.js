'use strict';

const fs = require('fs');
const _forEach = require('lodash.foreach');
const _includes = require('lodash.includes');
const _isString = require('lodash.isstring');
const _keys = require('lodash.keys');
const _values = require('lodash.values');

class Plugins {
    constructor() {
        this.plugins = {};
    }

    initialize(core) {
        this.core = core;
    }

    load() {
        const self = this;

        try {
            const plugins = fs.readdirSync(self.core.options['plugin-location']);
            _forEach(plugins, (plugin_name) => {
                try {
                    const plugin_path = `${self.core.options['plugin-location']}/${plugin_name}`;

                    _forEach(_keys(require.cache), (cache) => {
                        if(cache.indexOf(plugin_path) != -1)
                            delete require.cache[cache];
                    });

                    const plugin = require(plugin_path);

                    if((_isString(plugin.type) && plugin.type == 'core') || (Array.isArray(plugin.type) && _includes(plugin.type, 'core'))) {
                        plugin.initialize(self.core);
                        self.core.loggers['containership.core'].log('verbose', `Loaded ${plugin_name} plugin`);
                        self.plugins[plugin_name] = plugin;
                    }
                } catch(err) {
                    self.core.loggers['containership.core'].log('warn', `Failed to load ${plugin_name} plugin`);
                    self.core.loggers['containership.core'].log('warn', err.message);
                }
            });

            self.core.loggers['containership.core'].log('info', `Successfully loaded ${_keys(self.plugins).length} plugins!`);
        } catch(err) {
            self.core.loggers['containership.core'].log('warn', 'Invalid plugin path provided!');
            self.core.loggers['containership.core'].log('warn', err.message);
        }
    }

    reload () {
        const plugins = _values(module.exports.plugins);
        _forEach(plugins, (plugin) => { plugin.reload(); });
        module.exports.plugins = {};
        module.exports.load();
    }

}

module.exports = new Plugins();
