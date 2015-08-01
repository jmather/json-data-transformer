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
AnnouncementTransformer.prototype.process = function(input, output) {
    if (!input.announcements || input.announcements.length < 1) {
        return;
    }

    output.announcements = {};

    _.each(input.announcements, function (config, name) {
        output.announcements[name] = processAnnouncement(name, config);
    });
};

/**
 *
 * @param {string} name
 * @param {{suits: Array.<string>, faces: Array.<string>, extra: Array.<string>}} config
 *
 * @return {Array.<string>}
 */
function processAnnouncement(name, config) {
    var messages = [];

    var count = config.repeat || 1;

    for (var i = 0; i < count; i++) {
        messages.push(config.say);
    }

    return messages;
}

module.exports = AnnouncementTransformer;