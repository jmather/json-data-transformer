var fs = require('fs');
var _ = require('underscore');

/**
 *
 * @param {Array.<{process: function}>} transformers
 * @constructor
 */
function Transformer(transformers) {
    this.transformers = transformers;
}

Transformer.loadData = function(directories) {
    var data = {};

    _.each(directories, function(directory) {
        _.extend(data, loadDataDirectory('', directory))
    });

    return data;
};

function loadDataDirectory(prefix, directoryPath) {
    var data = {};

    var files = fs.readdirSync(directoryPath);
    var directories = [];
    _.each(files, function(file) {
        var filePath = directoryPath + '/' + file;
        if (fs.statSync(filePath).isDirectory()) {
            directories.push(file);
            return;
        }

        if (file.substr(-5) !== '.json') {
            return;
        }

        var key = file.substr(0, file.length -5);
        var fileData = JSON.parse(fs.readFileSync(filePath));

        _.each(fileData, function(val, valKey) {
            data[prefix + key + '.' + valKey] = val;
        });
    });

    _.each(directories, function(directory) {
        _.extend(data, loadDataDirectory(directory + '.', directoryPath + '/' + directory))
    });

    return data;
}

Transformer.prototype.transform = function(data) {
    var compiledData = {};

    _.each(this.transformers, function(transformer) {
        if (transformer.preProcess) {
            transformer.preProcess(data, compiledData);
        }
    });

    _.each(this.transformers, function(transformer) {
        if (transformer.process) {
            transformer.process(data, compiledData);
        }
    });

    _.each(this.transformers, function(transformer) {
        if (transformer.postProcess) {
            transformer.postProcess(data, compiledData);
        }
    });

    return compiledData;
};

module.exports = Transformer;
