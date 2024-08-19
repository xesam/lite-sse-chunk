const Default_Data_Pattern = () => /data: (.*)\n\n/g;


function createReader(option = {}) {
    let regexFactory;
    const regex = option.regex || Default_Data_Pattern;
    const messageProcessor = option.messageProcessor;
    if (typeof regex === 'string') {
        regexFactory = () => new RegExp(regex, 'g');
    } else if (regex.constructor === RegExp) {
        regexFactory = () => new RegExp(regex);
    } else if (typeof regex === 'function') {
        regexFactory = regex;
    } else {
        throw new Error('regex should be string/regexp/function');
    }

    return function read(chunkText, lastUncompleted = '') {
        const completed_messages = [];
        const pattern = regexFactory();
        const fullText = lastUncompleted + chunkText;
        let matched = pattern.exec(fullText);
        let matchedLastIndex = 0;
        while (matched) {
            matchedLastIndex = pattern.lastIndex;
            const messageBody = matched[1];
            if (messageProcessor) {
                completed_messages.push(messageProcessor(messageBody));
            } else {
                completed_messages.push(messageBody);
            }
            matched = pattern.exec(fullText);
        }

        return {
            messages: completed_messages,
            uncompleted: fullText.substring(matchedLastIndex)
        };
    };
}

exports.createReader = createReader;
exports.simpleReader = createReader();
