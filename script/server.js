import { env } from 'process';
import { readFileSync } from 'fs';
import { createServer } from 'https';
import serveStatic from 'serve-static';
import finalhandler from 'finalhandler';

const {
  CERT,
  HOST,
  PORT,
} = env;

const read = extension =>
  readFileSync(`${CERT}/${HOST}.${extension}`);

const options = {
  cert: read('crt'),
  key: read('key'),
};

const serve = serveStatic('public');

function callback(...argumentList) {
  serve(...argumentList, finalhandler(...argumentList));
}

createServer(options, callback).listen(PORT);
