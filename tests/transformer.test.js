var _ = require('underscore');
var sinon = require('sinon');
var Transformer = require('../index');

describe('Transformer', function() {
    describe('loadData', function() {

        it('should load data correctly', function() {
            var data = Transformer.loadData([__dirname + '/../test-data/config']);

            var expects = {
                'things.super.something': 'hello',
                'things.super': {
                    fantastic: true
                }
            };

            data.should.eql(expects);
        });
    });

    describe('process', function() {
        it('should have a lifecycle', function() {
            var processor = {
                preProcess: sinon.spy(),
                process: sinon.spy(),
                postProcess: sinon.spy(),
                noProcess: sinon.spy()
            };

            var transformer = new Transformer([processor]);

            transformer.transform({});

            processor.preProcess.called.should.equal(true);
            processor.process.called.should.equal(true);
            processor.postProcess.called.should.equal(true);
            processor.noProcess.called.should.equal(false);
        });
    });
});