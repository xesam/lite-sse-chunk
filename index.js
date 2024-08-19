const { TextStream } = require('./src/streams');
const { ThrottleThrough } = require('./src/through');
const { createRegexExtractor } = require('./src/chunk-extractors');

exports.createReader = createRegexExtractor;
exports.TextStream = TextStream;
exports.ThrottleThrough = ThrottleThrough;