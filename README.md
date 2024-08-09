# Lite SSE(sever send event) Chunk

a lite tool for parse sse chunk.

![stream profile](./stream.png)

## 使用

```javascript
const { TextStream } = require('lite-sse-chunk');
const stream = new TextStream();
stream.addChunkListener(messages => {
    console.log(messages);// the messages of newest chunk
    console.log(Array.isArray(messages)); // always true!
});

theSource.on('chunk', (chunk) => {
    stream.receive(chunk);
});
```


