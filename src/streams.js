const { simpleChunkExtractor } = require('./chunk-extractors');

class TextStream {
    constructor(chunkExtractor) {
        this._chunk_extractor = chunkExtractor || simpleChunkExtractor;
        this._completed_messages = [];
        this._uncompleted = '';
        this._listeners = [];
    }

    receive(text) {
        const { messages, uncompleted } = this._chunk_extractor(text, this._uncompleted);
        this._completed_messages.push(...messages);
        this._uncompleted = uncompleted;
        this._listeners.forEach((listener) => listener(messages));
    }

    addChunkListener(listener) {
        if (typeof listener !== 'function') {
            throw new Error('listener must be a function');
        }
        this._listeners.push(listener);
        return () => {
            const index = this._listeners.indexOf(listener);
            if (index !== -1) {
                this._listeners.splice(index, 1);
            }
        };
    }

    getCompletedMessages() {
        return this._completed_messages;
    }

    getUncompleted() {
        return this._uncompleted;
    }
}

exports.TextStream = TextStream;
