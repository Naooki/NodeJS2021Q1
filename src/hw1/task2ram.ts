import { readdir, readFile, writeFile } from 'fs/promises';
import { resolve as resolvePath } from 'path';

async function convertFiles(targeDir: string) {
  const fileNames = await readdir(targeDir).then((fileNames) =>
    fileNames
      .filter((fileName) => fileName.match(/(\.csv)$/))
      .map((fullName) => fullName.slice(0, -4)),
  );

  const convetions = fileNames.map(async (fileName) => {
    const content = await readFile(
      resolvePath(targeDir, `${fileName}.csv`),
    ).catch((err) => {
      console.error(err);
      throw err;
    });

    return writeFile(resolvePath(targeDir, `${fileName}.txt`), content).catch(
      (err) => {
        console.error(err);
        throw err;
      },
    );
  });

  return Promise.all(convetions);
}

process.chdir(__dirname);
convertFiles('./csv').then(() =>
  console.log('Files converted succussully (full load into RAM).'),
);
