var nodePath = require('path');
var transport = require('lasso-modules-client/transport');

exports.create = function(config, lasso) {
    return {
        properties: {
            path: 'string',
            wait: 'boolean',
            file: 'string' // The original source file that this dependency is assocaited with
        },

        init(lassoContext) {

        },

        getDir: function() {
            return nodePath.dirname(this._file);
        },

        read: function(lassoContext) {
            // the default is to wait so only output options
            // if the wait value is not equal to the default value
            var runOptions = (this.wait === false) ? {wait: false} : undefined;

            return transport.codeGenerators.run(
                // the path to the resource
                this.path,

                // options for runCode
                runOptions,

                // options that affect how the code is generated
                {
                    modulesRuntimeGlobal: config.modulesRuntimeGlobal
                });
        },

        getLastModified: function(lassoContext, callback) {
            callback(null, -1);
        },

        getUnbundledTargetPrefix: function(lassoContext) {
            return config.unbundledTargetPrefix;
        },

        getUnbundledTarget: function() {
            var bundleName = this.path;

            var ext = nodePath.extname(bundleName);

            if (ext) {
                bundleName = bundleName.substring(0, bundleName.length - ext.length);
            }

            return bundleName + '-run' + ext;
        },

        calculateKey: function() {
            return 'modules-run:' + this.path + '|' + this.wait;
        }
    };
};