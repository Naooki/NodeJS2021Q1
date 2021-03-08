import { Transform, TransformCallback } from 'stream';

class ReverseStream extends Transform {
  _transform(chunk, encoding, callback) {
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


console.log('Enter any string:\n');
process.stdin.pipe(reverseStream).pipe(process.stdout);
