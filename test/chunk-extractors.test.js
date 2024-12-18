const { simpleChunkExtractor } = require('../src/chunk-extractors');

describe('simpleChunkExtractor', function() {
    test.each(['', 'xxx '])('process single completed', (extra) => {
        const res = simpleChunkExtractor(extra + 'data: hello\n\n');

        expect(res).toEqual({
            messages: ['hello'],
            uncompleted: ''
        });
    });
    test.each(['', 'xxx '])('process single completed with last uncompleted', (extra) => {
        const res = simpleChunkExtractor('lo\n\n', extra + 'data: hel');

        expect(res).toEqual({
            messages: ['hello'],
            uncompleted: ''
        });
    });
    test.each(['', 'xxx '])('process single uncompleted', (extra) => {
        const res = simpleChunkExtractor(extra + 'data: hel');

        expect(res).toEqual({
            messages: [],
            uncompleted: extra + 'data: hel'
        });
    });
    test.each(['', 'xxx '])('process single uncompleted with last uncompleted', (extra) => {
        const res = simpleChunkExtractor('ta: hel', extra + 'da');

        expect(res).toEqual({
            messages: [],
            uncompleted: extra + 'data: hel'
        });
    });
    test.each(['', 'xxx '])('process multi completed', (extra) => {
        const res = simpleChunkExtractor(extra + 'data: hello\n\ndata: world!\n\n');

        expect(res).toEqual({
            messages: ['hello', 'world!'],
            uncompleted: ''
        });
    });
    test.each(['', 'xxx '])('process multi completed with last uncompleted', (extra) => {
        const res = simpleChunkExtractor(' hello\n\ndata: world!\n\n', extra + 'data:');

        expect(res).toEqual({
            messages: ['hello', 'world!'],
            uncompleted: ''
        });
    });
    test.each(['', 'xxx '])('process multi uncompleted', (extra) => {
        const res = simpleChunkExtractor(`data: hello\n\n${extra}data: world!`);

        expect(res).toEqual({
            messages: ['hello'],
            uncompleted: extra + 'data: world!'
        });
    });
    test.each(['', 'xxx '])('process multi uncompleted [2]', (extra) => {
        const res = simpleChunkExtractor(`data: hello\n\ndata: world!\n\n${extra}data: my name`);

        expect(res).toEqual({
            messages: ['hello', 'world!'],
            uncompleted: extra + 'data: my name'
        });
    });
    test.each(['', 'xxx '])('process multi uncompleted with last uncompleted [1]', (extra) => {
        const res = simpleChunkExtractor(' hello\n\ndata: world!', extra + 'data:');

        expect(res).toEqual({
            messages: ['hello'],
            uncompleted: 'data: world!'
        });
    });
    test.each(['', 'xxx '])('process multi uncompleted with last uncompleted [3]', (extra) => {
        const res = simpleChunkExtractor(' hello\n\ndata: world!\n\ndata: my name', extra + 'data:');

        expect(res).toEqual({
            messages: ['hello', 'world!'],
            uncompleted: 'data: my name'
        });
    });
});
