import inquirer from 'inquirer';
import conventionalCommitTypes from 'conventional-commit-types';
import chalk from 'chalk';
import execa from 'execa';

interface PromptResponse {
  type: string;
  scope: string;
  message: string;
  confirm: boolean;
}

function processCommitMessage({ type, scope, message }: PromptResponse) {
  const scopePartial = scope ? `(${scope})` : '';

  return `${type}${scopePartial}: ${message}`;
}

const main = async () => {
  const commitTypes: object = conventionalCommitTypes.types;
  const numberOfCommitTypes: number = Object.keys(commitTypes).length;
  const longestCommitTypeLength: number = Object.keys(commitTypes)
    .map(type => type.length)
    .sort()[numberOfCommitTypes - 1];

  const res: PromptResponse = await inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: 'Select commit type:',
      choices: Object.entries(commitTypes).map(([type, typeObj]) => ({
        name: `${chalk.bold(type.padStart(longestCommitTypeLength))} | ${
          typeObj.description
        }`,
        value: type,
        short: type,
      })),
    },
    {
      type: 'input',
      name: 'scope',
      message: `Write scope ${chalk.dim('(optional)')}:`,
      filter: (input: string) => input.trim(),
    },
    {
      type: 'input',
      name: 'message',
      message: 'Write message:',
      filter: (input: string) => input.trim(),
    },
    {
      type: 'confirm',
      name: 'confirm',
      default: true,
      message: (res: PromptResponse) =>
        `Confirm commit? ${chalk.green(processCommitMessage(res))}`,
    },
  ]);

  if (res.confirm === false) return;

  const commitMessage = processCommitMessage(res);

  try {
    await execa.command(`git commit -m "${commitMessage}"`);
  } catch (e) {
    e.stderr ? console.error(e.stderr) : console.error(e);
  }
};

main();
