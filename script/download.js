import { get } from 'https';
import { createWriteStream } from 'fs';
import { basename } from 'path';

const ORIGIN = 'https://m.bednarz.dev';
const TEST_MODULE = `${ORIGIN}/test.js`;
const TEST_IO_MODULE = `${ORIGIN}/test-io.js`;

function download(url) {
	const destination = basename(url);
	const file = createWriteStream(destination);

	function executor(resolve) {
		function onResponse(response) {
			response.pipe(file);
			resolve(destination);
		}

		get(url, onResponse);
	}

	return new Promise(executor);
}

function onResolved(queue) {
	console.info(`Downloaded ${queue.length} files:`);

	for (const file of queue) {
		console.info(`- ${file}`);
	}
}

function onRejected(reason) {
	console.error(reason);
}

Promise
	.all([
		download(TEST_MODULE),
		download(TEST_IO_MODULE),
	])
	.then(onResolved)
	.catch(onRejected);

