'use strict';
var nodePath = require('path');
var chai = require('chai');
chai.config.includeStack = true;
require('chai').should();
var MockLassoContext = require('./mock/MockLassoContext');

describe('lasso-require/dep-transport-run' , function() {
    require('./autotest').scanDir(
        nodePath.join(__dirname, 'fixtures/dep-transport-run/autotest'),
        function (dir, done) {
            var main = require(nodePath.join(dir, 'test.js'));
            var dependencyProps = main.createDependency(dir);

            var pluginConfig = main.getPluginConfig ? main.getPluginConfig() : {};
            pluginConfig.rootDir = dir;

            var dependencyFactory = require('./mock/dependency-factory').create(pluginConfig);

            var dependency = dependencyFactory.depTransportRun(dependencyProps);

            var lassoContext = new MockLassoContext();

            dependency.init(lassoContext);

            return Promise.resolve()
                .then(() => {
                    return dependency.read(lassoContext);
                })
                .then((src) => {
                    done(null, src);
                })
                .catch(done);
        },
        {
            ext: '.js'
        });
});