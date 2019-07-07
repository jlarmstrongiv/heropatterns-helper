import AdmZip from 'adm-zip';

// https://github.com/sindresorhus/import-lazy#usage-with-bundlers
import importLazy from 'import-lazy';
const sharp = importLazy(() => require('sharp'))();

export const FileType = {
  JPEG: 'JPEG',
  PNG: 'PNG',
  SVG: 'SVG',
  ZIP: 'ZIP',
};

export const getMetadata = heroPatternText => {
  if (!heroPatternText) throw new Error('No pattern provided');

  // regex must be reset
  // https://stackoverflow.com/questions/4724701/regexp-exec-returns-null-sporadically
  const widthRegex = /width='(\d+)'/g;
  const heightRegex = /height='(\d+)'/g;
  const svgRegex = /data:image\/svg\+xml,(.*)"\);/g;
  const backgroundColorRegex = /background-color: #(.{1,6});/g;
  const foregroundColorRegex = /fill='%23(.{1,6})/g;

  heroPatternText = heroPatternText.trim();

  // https://regexr.com/
  const width = widthRegex.exec(heroPatternText)[1];
  const height = heightRegex.exec(heroPatternText)[1];
  const foregroundColor = foregroundColorRegex.exec(heroPatternText)[1];
  const backgroundColor = backgroundColorRegex.exec(heroPatternText)[1];

  let originalSvg = svgRegex.exec(heroPatternText);
  originalSvg = decodeURIComponent(originalSvg[1]);

  // add background color
  // viewport fill not supported
  // https://stackoverflow.com/a/11293812
  // rectangle must be drawn first
  // https://stackoverflow.com/a/25302276
  const bracketIndex = originalSvg.indexOf('>') + 1;
  const editedSvg = `${originalSvg.slice(
    0,
    bracketIndex,
  )}<rect width='100%' height='100%' fill='#${backgroundColor}'></rect>${originalSvg.slice(
    bracketIndex,
    originalSvg.length,
  )}`;

  return {
    width,
    height,
    backgroundColor,
    foregroundColor,
    svg: editedSvg,
  };
};

export const toJpeg = async heroPatternSvg => {
  if (!heroPatternSvg) throw new Error('No pattern provided');

  // svg input must be buffer
  // https://github.com/lovell/sharp/issues/979#issuecomment-334931655
  const image = await sharp(Buffer.from(heroPatternSvg))
    .toFormat('jpeg')
    .toBuffer();

  return image;
};

export const toPng = async heroPatternSvg => {
  if (!heroPatternSvg) throw new Error('No pattern provided');

  const image = await sharp(Buffer.from(heroPatternSvg))
    .toFormat('png')
    .toBuffer();

  return image;
};

export const toSvg = async heroPatternSvg => {
  if (!heroPatternSvg) throw new Error('No pattern provided');
  return Buffer.from(heroPatternSvg);
};

export const toZip = async (
  heroPatternSvg,
  files = {},
  fileName,
  licenseText = '',
) => {
  if (!heroPatternSvg) throw new Error('No pattern provided');

  const jpeg = files[FileType.JPEG] || (await toJpeg(heroPatternSvg));
  const png = files[FileType.PNG] || (await toPng(heroPatternSvg));
  const svg = files[FileType.SVG] || (await toSvg(heroPatternSvg));

  const zip = new AdmZip();

  zip.addFile(fileName ? `${fileName}.jpeg` : 'heropattern.jpeg', jpeg);
  zip.addFile(fileName ? `${fileName}.png` : 'heropattern.png', png);
  zip.addFile(fileName ? `${fileName}.svg` : 'heropattern.svg', svg);
  zip.addFile('LICENSE.txt', Buffer.from(licenseText));

  return zip.toBuffer();
};
