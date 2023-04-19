import inquirer from 'inquirer';

export default async () => {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'filePath',
      message: 'Enter the directory of your project:',
    },
  ]);

  const dirPath = answers.filePath;
  return dirPath;
};