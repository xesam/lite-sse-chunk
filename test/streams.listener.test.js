const { TextStream } = require('..');

describe('streams[listener]', function () {
    it('listener must be a function', function () {
        expect(() => new TextStream().addChunkListener(1)).toThrow('listener must be a function');
    });
    test('listener should be called', () => {
        const chunkStream = new TextStream();
        const listener1 = jest.fn();
        const listener2 = jest.fn();
        chunkStream.addChunkListener(listener1);
        chunkStream.addChunkListener(listener2);

        for (const chunk of ['data: hello\n\ndata: world!\n\n', 'data: my name\n\n']) {
            chunkStream.receive(chunk);
        }
        expect(listener1).toHaveBeenNthCalledWith(1, ['hello', 'world!']);
        expect(listener1).toHaveBeenNthCalledWith(2, ['my name']);
        expect(listener2).toHaveBeenNthCalledWith(1, ['hello', 'world!']);
        expect(listener2).toHaveBeenNthCalledWith(2, ['my name']);
    });
    test('listener can be removed', () => {
        const chunkStream = new TextStream();
        const listener1 = jest.fn();
        const listener2 = jest.fn();
        const remove1 = chunkStream.addChunkListener(listener1);
        chunkStream.addChunkListener(listener2);

        for (const chunk of ['data: hello\n\ndata: world!\n\n']) {
            chunkStream.receive(chunk);
        }

        remove1();

        for (const chunk of ['data: my name\n\n']) {
            chunkStream.receive(chunk);
        }

        expect(listener1).toHaveBeenCalledTimes(1);
        expect(listener2).toHaveBeenCalledTimes(2);
    });
});
