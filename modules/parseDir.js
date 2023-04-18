import ignore from 'ignore';
import inquirer from 'inquirer';
import klawSync from 'klaw-sync';
import fs from 'fs';
import path from 'path';

const getIgnoredPaths = (ignoreFilePath) => {
  if (fs.existsSync(ignoreFilePath)) {
    const gitignoreContent = fs.readFileSync(ignoreFilePath, 'utf8');
    return ignore().add(gitignoreContent).add('.git').add('.git/*').add('.github').add('.github/*');
  }
  return null;
};

const displayFilteredDirectoryStructure = (dirPath, ignoredPaths) => {
  const items = klawSync(dirPath, { nodir: false, traverseAll: true });

  const pathItems = []

  items.forEach((item) => {
    try{
        const relativePath = path?.relative(dirPath, `${item?.path}`);
        if (!ignoredPaths || !ignoredPaths?.ignores(relativePath)) {
          pathItems.push(relativePath);
        }
    } catch {
      console.log('WARNING: couldnt parse path item: ', item);
    }
  });

  return pathItems.join('\n')
};

export default async (dirPath) => {
  const ignoreFilePath = path.join(dirPath, '.gitignore');
  const ignoredPaths = getIgnoredPaths(ignoreFilePath);

  return displayFilteredDirectoryStructure(dirPath, ignoredPaths);
};