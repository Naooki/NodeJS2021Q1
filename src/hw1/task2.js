import { createReadStream, createWriteStream } from 'fs';
import { readdir } from 'fs/promises';
import { resolve as resolvePath } from 'path';
import { promisify } from 'util';
import { pipeline as pipelineDefault } from 'stream';

const pipeline = promisify(pipelineDefault);

function convertFiles(targeDir) {
  return readdir(targeDir)
    .then((fileNames) =>
      fileNames
        .filter((fileName) => fileName.match(/(\.csv)$/))
        .map((fullName) => fullName.slice(0, -4)),
    )
    .then((fileNames) =>
      fileNames.map((fileName) =>
        pipeline(
          createReadStream(resolvePath(targeDir, `${fileName}.csv`)),
          createWriteStream(resolvePath(targeDir, `${fileName}.txt`)),
        ).catch((err) => console.error(err)),
      ),
    )
    .then((pipelines) => Promise.all(pipelines));
}

process.chdir(__dirname);
convertFiles('./csv').then(() =>
  console.log('All files converted successfully.'),
);
