import { Transform, TransformCallback } from 'stream';

class ReverseStream extends Transform {
  _transform(
    chunk: Buffer,
    // eslint-disable-next-line no-undef
    encoding: BufferEncoding,
    callback: TransformCallback,
  ) {
    const bufferReversed = chunk.slice(0, -1).reverse();
    const newLine = Buffer.from([0x0a, 0x0a]);
    callback(null, Buffer.concat([bufferReversed, newLine]));
  }
}

const reverseStream = new ReverseStream();

console.log('Enter any string:\n');
process.stdin.pipe(reverseStream).pipe(process.stdout);
