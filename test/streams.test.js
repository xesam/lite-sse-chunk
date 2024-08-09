const { TextStream } = require('..');

describe('streams[receive chunk]', function() {
    test('process single completed', () => {
        const chunks = ['data: hello\n\n'];
        const chunkStream = new TextStream();

        for (const chunk of chunks) {
            chunkStream.receive(chunk);
        }

        expect(chunkStream.getCompletedMessages()).toEqual(['hello']);
        expect(chunkStream.getUncompleted()).toEqual('');
    });
    test('process single divided completed [1]', () => {
        const chunks = ['data: hel', 'lo\n\n'];
        const chunkStream = new TextStream();

        for (const chunk of chunks) {
            chunkStream.receive(chunk);
        }

        expect(chunkStream.getCompletedMessages()).toEqual(['hello']);
        expect(chunkStream.getUncompleted()).toEqual('');
    });
    test('process single divided completed [2]', () => {
        const chunks = ['data: hel', 'l', 'o\n', '\n'];
        const chunkStream = new TextStream();

        for (const chunk of chunks) {
            chunkStream.receive(chunk);
        }

        expect(chunkStream.getCompletedMessages()).toEqual(['hello']);
        expect(chunkStream.getUncompleted()).toEqual('');
    });
    test('process single uncompleted', () => {
        const chunks = ['data: hel'];
        const chunkStream = new TextStream();

        for (const chunk of chunks) {
            chunkStream.receive(chunk);
        }

        expect(chunkStream.getCompletedMessages()).toEqual([]);
        expect(chunkStream.getUncompleted()).toEqual('data: hel');
    });
    test('process single divided uncompleted [1]', () => {
        const chunks = ['data: hel', 'l'];
        const chunkStream = new TextStream();

        for (const chunk of chunks) {
            chunkStream.receive(chunk);
        }

        expect(chunkStream.getCompletedMessages()).toEqual([]);
        expect(chunkStream.getUncompleted()).toEqual('data: hell');
    });
    test('process single divided uncompleted [2]', () => {
        const chunks = ['data: he', 'l', 'l', 'o'];
        const chunkStream = new TextStream();

        for (const chunk of chunks) {
            chunkStream.receive(chunk);
        }

        expect(chunkStream.getCompletedMessages()).toEqual([]);
        expect(chunkStream.getUncompleted()).toEqual('data: hello');
    });
    test('process multi completed [1]', () => {
        const chunks = ['data: hello\n\n', 'data: world!\n\n'];
        const chunkStream = new TextStream();

        for (const chunk of chunks) {
            chunkStream.receive(chunk);
        }

        expect(chunkStream.getCompletedMessages()).toEqual(['hello', 'world!']);
        expect(chunkStream.getUncompleted()).toEqual('');
    });
    test('process multi completed [2]', () => {
        const chunks = ['data: hello\n\ndata: world!\n\n'];
        const chunkStream = new TextStream();

        for (const chunk of chunks) {
            chunkStream.receive(chunk);
        }

        expect(chunkStream.getCompletedMessages()).toEqual(['hello', 'world!']);
        expect(chunkStream.getUncompleted()).toEqual('');
    });
    test('process multi divided completed [1]', () => {
        const chunks = ['data: hel', 'lo\n\n', 'data: wor', 'ld!\n\n'];
        const chunkStream = new TextStream();

        for (const chunk of chunks) {
            chunkStream.receive(chunk);
        }

        expect(chunkStream.getCompletedMessages()).toEqual(['hello', 'world!']);
        expect(chunkStream.getUncompleted()).toEqual('');
    });
    test('process multi divided completed [2]', () => {
        const chunks = ['data: hel', 'lo\n\ndata: wor', 'ld!\n\n'];
        const chunkStream = new TextStream();

        for (const chunk of chunks) {
            chunkStream.receive(chunk);
        }

        expect(chunkStream.getCompletedMessages()).toEqual(['hello', 'world!']);
        expect(chunkStream.getUncompleted()).toEqual('');
    });
    test('process multi uncompleted [1]', () => {
        const chunks = ['data: hello\n\n', 'data: world!\n\n', 'data: my name'];
        const chunkStream = new TextStream();

        for (const chunk of chunks) {
            chunkStream.receive(chunk);
        }

        expect(chunkStream.getCompletedMessages()).toEqual(['hello', 'world!']);
        expect(chunkStream.getUncompleted()).toEqual('data: my name');
    });
    test('process multi uncompleted [2]', () => {
        const chunks = ['data: hello\n\ndata: world!\n\n', 'data: my name'];
        const chunkStream = new TextStream();

        for (const chunk of chunks) {
            chunkStream.receive(chunk);
        }

        expect(chunkStream.getCompletedMessages()).toEqual(['hello', 'world!']);
        expect(chunkStream.getUncompleted()).toEqual('data: my name');
    });
    test('process multi divided uncompleted [1]', () => {
        const chunks = ['data: hello\n', '\n', 'dat', 'a: wor'];
        const chunkStream = new TextStream();

        for (const chunk of chunks) {
            chunkStream.receive(chunk);
        }

        expect(chunkStream.getCompletedMessages()).toEqual(['hello']);
        expect(chunkStream.getUncompleted()).toEqual('data: wor');
    });
    test('process multi divided uncompleted [2]', () => {
        const chunks = ['data: hello\n\ndata: world!\n\n', 'data: ', 'my name'];
        const chunkStream = new TextStream();

        for (const chunk of chunks) {
            chunkStream.receive(chunk);
        }

        expect(chunkStream.getCompletedMessages()).toEqual(['hello', 'world!']);
        expect(chunkStream.getUncompleted()).toEqual('data: my name');
    });
});
