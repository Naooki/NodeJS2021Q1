import { readdir, readFile, writeFile } from 'fs/promises';
import { resolve as resolvePath } from 'path';
import csvtojson from 'csvtojson';

async function convertFiles(targeDir) {
  const fileNames = await readdir(targeDir).then((fileNames) =>
    fileNames
      .filter((fileName) => fileName.match(/(\.csv)$/))
      .map((fullName) => fullName.slice(0, -4)),
  );

  const convetions = fileNames.map(async (fileName) => {
    const jsonContent = await csvtojson({ downstreamFormat: 'array' })
      .fromFile(resolvePath(targeDir, `${fileName}.csv`))
      .then(JSON.stringify)
      .catch((err) => {
        console.error(err);
        throw err;
      });

    return writeFile(resolvePath(targeDir, `${fileName}.txt`), jsonContent).catch(
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
