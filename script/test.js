/**
 * Example of running the universal tests with Node.js.
 * In an external project, you'd need to retrieve the
 * `test` and `test-io` modules first from the network,
 * since Node currently only supports `file://` URLs.
 */
import { promisify } from 'util';
import glob from 'glob';
import { failing, load, printReport } from 'file:///home/node/app/public/test-io.js';

/* global process */

const { argv, cwd } = process;
const [, , option] = argv;
const verbose = option === '-v';
const find = promisify(glob);
const pattern = 'public/*.test.js';

const toFileUrl = file =>
  `file://${cwd()}/${file}`;

const map = files =>
  files
    .map(toFileUrl);

function getReportArguments(result, errors) {
  if (errors) {
    return ['failing', failing(result)];
  }

  return ['result', result];
}

function resolved([result, [, , errors]]) {
  if (verbose) {
    const argumentList = getReportArguments(result, errors);

    printReport(...argumentList);
  } else {
    console.info('# see the complete report by using the -v option');
  }
}

function rejected(reason) {
  console.error(reason);
}

find(pattern)
  .then(map)
  .then(load)
  .then(resolved)
  .catch(rejected);
