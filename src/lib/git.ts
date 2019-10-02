import execa from 'execa';
import chalk from 'chalk';
import getStagedFiles, { StagedFile } from 'staged-git-files';

import { printMessage } from './util';

export { getStagedFiles, StagedFile }; // TODO: wrap third-party

export function printStagedFiles(files: StagedFile[]): void {
  const longestStatusLength = files
    .map(file => file.status.length)
    .sort()
    .reverse()[0];

  printMessage(
    chalk.bold('Changes to commit:') +
      '\n\n' +
      files
        .map(file => {
          var chalkFn;

          if (file.status === 'Added') chalkFn = chalk.green;
          else if (file.status === 'Deleted') chalkFn = chalk.red;
          else chalkFn = chalk.yellow;

          return chalkFn(
            `${file.status.padStart(longestStatusLength + 1)} ${file.filename}`
          );
        })
        .join('\n') +
      '\n'
  );
}

export async function commit(commitMessage: string): Promise<void> {
  try {
    await execa('git', ['commit', '-m', commitMessage], {
      stdio: 'inherit',
    });
  } catch (e) {} // Error is already printed by inherited stdio.
}
