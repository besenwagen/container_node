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

const read = type =>
  readFileSync(`${CERT}/${HOST}-${type}.pem`);

const options = {
  cert: read('cert'),
  key: read('key'),
};

const serve = serveStatic('public');

function callback(...argumentList) {
  serve(...argumentList, finalhandler(...argumentList));
}

createServer(options, callback).listen(PORT);
