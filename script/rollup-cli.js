#!/usr/bin/env node
import { join } from 'path';
import { build } from './rollup.js';

/* global process */

const {
	argv: [, , asset, ...options],
	cwd,
} = process;

const files = await build({
	asset,
	debug: options.includes('-d'),
	path: join(cwd(), 'public, script'),
});

console.info(JSON.stringify(files, null, 2));
