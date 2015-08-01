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

Transformer.prototype.loadData = function(directories) {
    var data = {};

    _.each(directories, function(directory) {
        _.extend(data, this.loadDataDirectory(directory))
    }.bind(this));

    return data;
};

Transformer.prototype.loadDataDirectory = function(directoryPath) {
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
        data[key] = JSON.parse(fs.readFileSync(filePath));
    });

    return data;
};

Transformer.prototype.build = function(directories) {
    var data = this.loadData(directories);
    var compiledData = {};

    _.each(this.transformers, function(Transformer) {
        var transformer = new Transformer({});
        transformer.process(data, compiledData);
    });

    return compiledData;
};

module.exports = Transformer;
