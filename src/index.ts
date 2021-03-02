import { Transform, TransformCallback } from 'stream';

class ReverseStream extends Transform {
  _transform(
    chunk: Buffer,
    encoding: BufferEncoding,
    callback: TransformCallback,
  ) {
    const reversed = chunk
      .toString('utf8')
      .split('')
      .slice(0, -1) // remove extra new-line
      .reverse()
      .join('');
    callback(null, `${reversed}\n\n`);
  }
}

const reverseStream = new ReverseStream();

process.stdin.pipe(reverseStream).pipe(process.stdout);
