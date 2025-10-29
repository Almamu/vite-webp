import fs from 'fs';
import path from 'path';
import helper from '../helper';
import sharpWebp from './sharp';
function createWebp(dir: string, output: string | null, options: UserOptions) {
  if (fs.existsSync(dir) === false) {
    return;
  }
  const { imageType, sharpOptions } = options;
  const files = fs.readdirSync(dir);
  files.forEach((v) => {
    const abs = path.join(dir, v);
    if (helper.isDirectory(abs)) {
      createWebp(abs, output ? path.join(output, v) : null, options);
    } else if (helper.isTargetImage(abs, imageType)) {
      const nPath = helper.getWebpPath(output ? path.join(output, v) : v);
      if (output) {
        fs.mkdirSync(output, { recursive: true });
      }
      sharpWebp(abs, nPath, sharpOptions);
    }
  })
}
export const webp = (options: UserOptions) => {
  const { onlyWebp, output } = options;

  const folders = helper.toArray(onlyWebp);
  const outputFolders = helper.toArray(output);

  if (outputFolders.length > 0) {
      if (folders.length !== outputFolders.length) {
          throw new Error('outputFolders and onlyWebp must be the same length');
      }
  }

  for (let i = 0; i < folders.length; i ++) {
      createWebp(folders[i], outputFolders.length > 0 ? outputFolders[i] : null, options);
  }
}
