#!/usr/bin/env node

import {
  getPromptResponse,
  PromptResponse,
  processCommitMessage,
} from './lib/prompt';
import { commit, printStagedFiles, getStagedFiles } from './lib/git';
import { printMessage, delay } from './lib/util';

const main = async () => {
  const stagedFiles = await getStagedFiles();
  if (stagedFiles.length == 0) {
    printMessage('Nothing to commit.');

    return;
  }
  printStagedFiles(stagedFiles);
  await delay(500); // fx

  const res = await getPromptResponse();
  if (res.confirm === false) return;

  const commitMessage = processCommitMessage(res);
  await commit(commitMessage);
};

main();
