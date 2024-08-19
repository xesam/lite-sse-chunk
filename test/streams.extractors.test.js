const { TextStream, createReader } = require('..');

describe('streams[chunk-extractors]', function() {
    function createTestChunks(prefix = 'data: ') {
        const messages = [
            {
                content: 'hello'
            },
            {
                content: 'world!'
            },
            {
                content: 'the last'
            }
        ];
        return messages.map(message => `${prefix}${JSON.stringify(message)}\n\n`);
    }

    test('custom data regex with reader', () => {
        const parser = createReader({ regex: /chunk: (.*)\n\n/g });
        const stream = new TextStream(parser);
        const listener1 = jest.fn();
        stream.addChunkListener(listener1);

        for (const chunk of createTestChunks('chunk: ')) {
            stream.receive(chunk);
        }
        expect(listener1).toHaveBeenNthCalledWith(1, ['{"content":"hello"}']);
        expect(listener1).toHaveBeenNthCalledWith(2, ['{"content":"world!"}']);
        expect(listener1).toHaveBeenNthCalledWith(3, ['{"content":"the last"}']);
    });

    test('custom message processor with reader', () => {
        const parser = createReader({
            messageProcessor: JSON.parse
        });
        const stream = new TextStream(parser);
        const listener1 = jest.fn();
        stream.addChunkListener(listener1);

        for (const chunk of createTestChunks('data: ')) {
            stream.receive(chunk);
        }
        expect(listener1).toHaveBeenNthCalledWith(1, [{ 'content': 'hello' }]);
    });
    test('custom data regex and message processor with reader', () => {
        const parser = createReader({
            regex: /chunk: (.*)\n\n/g,
            messageProcessor: JSON.parse
        });
        const stream = new TextStream(parser);
        const listener1 = jest.fn();
        stream.addChunkListener(listener1);

        for (const chunk of createTestChunks('chunk: ')) {
            stream.receive(chunk);
        }
        expect(listener1).toHaveBeenNthCalledWith(1, [{ 'content': 'hello' }]);
    });
});
