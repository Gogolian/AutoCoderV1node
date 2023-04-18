import inquirer from 'inquirer';

export default async () => {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'task',
      message: 'Enter Task:',
    },
  ]);

  return answers.task;
};