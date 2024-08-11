# Lite SSE(sever send event) Chunk

a lite tool to parse sse chunk.

![stream profile](./stream.png)

```text
< chunk1 start
data: hello 

data: world!

data: this is
< chunk1 end

==> messages : ['hello', 'world!']

< chunk2 start
last!

< chunk2 end

===> messages : ['this is last!']

```

## Usage

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


