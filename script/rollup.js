export { build };

import { rollup } from 'rollup';
import terser from '@rollup/plugin-terser';
import prettier from 'rollup-plugin-prettier';
import url_resolve from 'rollup-plugin-url-resolve';

const { assign, create } = Object;

function dictionary(entries) {
	const bucket = create(null);

	if (entries) {
		return assign(bucket, entries);
	}

	return bucket;
}

const banner = '/* Debug bundle */ /* eslint-disable */\n';

const prettier_options = {
	parser: 'babel',
	printWidth: 72,
	singleQuote: true,
	trailingComma: 'es5',
	useTabs: true,
};

function parse_input_options(debug, path) {
	if (debug) {
		return [
			[
				new RegExp(`^${path}/[^/]+/.+\\.js$`),
			],
			prettier(prettier_options),
		];
	}

	return [
		null,
		terser(),
	];
}

function get_input_options({
	debug,
	asset,
	path,
}) {
	const [external, plugin] = parse_input_options(debug, path);

	return dictionary({
		input: `./public/script/${asset}.js`,
		external,
		plugins: [
			url_resolve({
				cacheManager: '.cache',
			}),
			plugin,
		],
	});
}

function get_output_options({ debug }) {
	const index = Number(!debug);

	return dictionary({
		banner,
		format: 'esm',
		manualChunks(id) {
			if (id.endsWith(`/public/script/vendor.js`)) {
				return 'vendor';
			}
		},
		chunkFileNames: [
			'[name]-bundle.js',
			'[name]-[hash].js',
		][index],
		dir: [
			'public/script',
			'public',
		][index],
		entryFileNames: [
			'[name]-bundle.js',
			'[name]-[hash].js',
		][index],
	});
}

const to_file_map = (accumulator, { name, fileName }) =>
	assign(accumulator, {
		[name]: fileName,
	});

async function build(options) {
	const input_options = get_input_options(options);
	const output_options = get_output_options(options);
	const bundled = await rollup(input_options);
	const { output } = await bundled.write(output_options);

	return output.reduce(to_file_map, dictionary());
}
