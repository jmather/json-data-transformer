# json-data-transformer
A tool for easily making JSON data transformations

# Installation

    npm install

# How it works

You require two things to use this package: A set of data, and a description of how to transform that data.

In our _examples_ directory, you will see a few examples of how this is put together.

To see it run in action, download and install, then run:

    ./bin/transform.js -c examples/hello-world/config -t examples/hello-world/transformers -p

To see a small example, or for a larger one:

    ./bin/transform.js -c examples/cards/config -t examples/cards/transformers -p

# Usage

Here's our basic hello world:

## Data

This will be our source data, inside _announcements.json_

    {
      "hello": {
        "say": "Hello world!",
        "repeat": 3
      }
    }

In the end, we will want it to look like this:

    {
      "announcements": {
        "hello": [
          "Hello world!",
          "Hello world!",
          "Hello world!"
        ]
      }
    }

## Transformer

We need to instruct the system how to do the transform, so we will do that in _announcements.js_:

    var _ = require('underscore');

    /**
     *
     * @param {{}} config
     * @constructor
     */
    function AnnouncementTransformer(config) {
        this.config = config;
    }

    /**
     *
     * @param {{announcements: Object.<string, {say: string, repeat: number}>}} input
     * @param {{announcements: Object.<string, Array.<string>>}} output
     */
    AnnouncementTransformer.process = function(input, output) {
        if (!input.announcements || input.announcements.length < 1) {
            return;
        }

        output.announcements = {};

        _.each(input.announcements, function (config, name) {
            output.announcements[name] = this.processAnnouncement(name, config);
        }.bind(this));
    };

    /**
     *
     * @param {string} name
     * @param {{suits: Array.<string>, faces: Array.<string>, extra: Array.<string>}} config
     *
     * @return {Array.<string>}
     */
    AnnouncementTransformer.processAnnouncement = function(name, config) {
        var messages = [];

        var count = config.repeat || 1;

        for (var i = 0; i < count; i++) {
            messages.push(config.say);
        }

        return messages;
    };

    module.exports = AnnouncementTransformer;

