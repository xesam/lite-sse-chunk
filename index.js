const { TextStream } = require('./src/streams');
const { ThrottleThrough } = require('./src/through');
const { createParser } = require('./src/readers');

exports.createParser = createParser;
exports.TextStream = TextStream;
exports.ThrottleThrough = ThrottleThrough;