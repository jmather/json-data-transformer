#!/usr/bin/env node
var fs = require('fs');
var cli = require('cli');
var _ = require('underscore');

cli.parse({
    configPath:   ['c', 'Config path', 'path'],
    transformerPath:  ['t', 'Transformer path', 'path'],
    outputPath: ['o', 'Output path', 'path'],
    pretty: ['p', 'Output pretty', 'bool', false],
    verbose: ['v', 'Verbose output']
});

cli.main(function(args, options) {
    var Transformer = require('../index');

    var transformerModules = getTrasformerModules([options.transformerPath]);

    var transformer = new Transformer(transformerModules);

    var data = transformer.build([options.configPath]);

    var output = JSON.stringify(data);

    if (options.pretty) {
        var pd = require('pretty-data').pd;
        output = pd.json(data);
    }

    if (options.outputPath) {
        require('fs').writeFileSync(options.outputPath, output);
    } else {
        console.log(output);
    }
});

/**
 *
 * @param {Array.<string>} paths
 */
function getTrasformerModules(paths) {
    var transformers = [];

    _.each(paths, function(path) {
        var dirFiles = fs.readdirSync(path);
        _.each(dirFiles, function(file) {
            var filePath = path + '/' + file.substr(0, file.length - 3);

            if (filePath.substr(0, 1) !== '/') {
                filePath = process.cwd() + '/' + filePath;
            }

            if (fs.lstatSync(filePath + '.js').isFile()) {

                transformers.push(require(filePath));
            }
        });
    });

    return transformers;
}