import chalk from 'chalk';
import conventionalCommitTypes from 'conventional-commit-types';
import inquirer from 'inquirer';

export interface PromptResponse {
  type: string;
  scope: string;
  message: string;
  confirm?: boolean;
}

export function processCommitMessage({ type, scope, message }: PromptResponse) {
  const scopePartial = scope ? `(${scope})` : '';

  return `${type}${scopePartial}: ${message}`;
}

export async function getPromptResponse(): Promise<PromptResponse> {
  const commitTypes: object = conventionalCommitTypes.types;
  const longestCommitTypeLength: number = Object.keys(commitTypes)
    .map(type => type.length)
    .sort()
    .reverse()[0];

  return inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: 'Select commit type:',
      choices: Object.entries(commitTypes).map(([type, typeObj]) => ({
        name: `${type.padStart(longestCommitTypeLength)} | ${
          typeObj.description
        }`,
        value: type,
        short: type,
      })),
    },
    {
      type: 'input',
      name: 'scope',
      message: `Write commit scope (e.g. routes, config, users) ${chalk.dim(
        '(optional)'
      )}:`,
      filter: (input: string) => input.trim(),
    },
    {
      type: 'input',
      name: 'message',
      message: 'Write commit message:',
      filter: (input: string) => input.trim(),
    },
    {
      type: 'confirm',
      name: 'confirm',
      default: true,
      message: (res: PromptResponse) =>
        `Confirm commit? ${chalk.green(`"${processCommitMessage(res)}"`)}`,
    },
  ]);
}
