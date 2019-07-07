const path = require('path');
const fs = require('fs-extra');
const fg = require('fast-glob');

const heroPatternHelper = require('../dist/index');

const FileType = heroPatternHelper.FileType;

const samplePattern = path.join(__dirname, './sample/**.txt');
const outputFolder = path.join(__dirname, './output');

const exportSample = async samplePath => {
  const heroPatternFile = await fs.readFile(samplePath);
  const heroPatternText = await heroPatternFile.toString().trim();

  const heroPatternMeta = await heroPatternHelper.getMetadata(heroPatternText);
  const heroPatternSvg = heroPatternMeta.svg;

  const outputName = path.basename(samplePath).replace(/\.[^/.]+$/, '');

  await fs.ensureDir(`${outputFolder}/${outputName}`);
  // jpeg
  const jpeg = await heroPatternHelper.toJpeg(heroPatternSvg);
  await fs.writeFile(`${outputFolder}/${outputName}/${outputName}.jpeg`, jpeg);
  // png
  const png = await heroPatternHelper.toPng(heroPatternSvg);
  await fs.writeFile(`${outputFolder}/${outputName}/${outputName}.png`, png);
  // svg
  const svg = await heroPatternHelper.toSvg(heroPatternSvg);
  await fs.writeFile(`${outputFolder}/${outputName}/${outputName}.svg`, svg);

  const files = {
    [FileType.JPEG]: jpeg,
    [FileType.PNG]: png,
    [FileType.SVG]: svg,
  };

  const zip = await heroPatternHelper.toZip(
    heroPatternSvg,
    files,
    outputName,
    'License Text',
  );
  await fs.writeFile(`${outputFolder}/${outputName}/${outputName}.zip`, zip);
};

const start = async () => {
  await fs.remove(outputFolder);
  const samplePaths = await fg(samplePattern);
  await Promise.all(samplePaths.map(exportSample));
};

try {
  start();
} catch (error) {
  console.log(error);
}
