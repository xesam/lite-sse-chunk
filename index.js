const { TextStream } = require('./src/streams');
const { ThrottleThrough } = require('./src/through');
const { createReader } = require('./src/readers');

exports.createReader = createReader;
exports.TextStream = TextStream;
exports.ThrottleThrough = ThrottleThrough;