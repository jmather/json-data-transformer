var _ = require('underscore');

/**
 *
 * @param {{}} config
 * @constructor
 */
function DeckTransformer(config) {
    this.config = config;
}

/**
 *
 * @param {{decks: Object.<string, {suits: Array.<string>, faces: Array.<string>, extra: Array.<string>}>}} input
 * @param {{decks: Object.<string, [{type: string, suit: string, face: string}]>}} output
 */
DeckTransformer.prototype.process = function(input, output) {
    if (!input.decks || input.decks.length < 1) {
        return;
    }

    output.decks = {};

    _.each(input.decks, function (config, name) {
        output.decks[name] = processDeck(name, config);
    }.bind(this));
};

/**
 *
 * @param {string} name
 * @param {{suits: Array.<string>, faces: Array.<string>, extra: Array.<string>}} config
 *
 * @return {Array.<{type: string, suit: string, face: string}>}
 */
function processDeck(name, config) {
    var cards = [];

    _.each(config.suits, function(suit) {
        _.each(config.faces, function(face) {
            cards.push({type: "card", suit: suit, face: face});
        });
    });

    _.each(config.extra, function(extra) {
        cards.push({type: extra, suit: extra, face: extra});
    });

    return cards;
}

module.exports = DeckTransformer;