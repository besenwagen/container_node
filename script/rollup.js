import rollupModule from 'rollup';
import urlResolve from 'rollup-plugin-url-resolve';
import prettier from 'rollup-plugin-prettier';

/* global process */

const { rollup } = rollupModule;
const EXIT_CODE_ERROR = 1;
const {
  argv: [, , input, file],
  exit,
} = process;

if (!input || !file) {
  console.error('missing arguments');
  exit(EXIT_CODE_ERROR);
}

const timestamp = new Date().toISOString();
const info = `Dependency modules bundle @${timestamp}`;
const { length } = info;
const banner = `
/**${'*'.repeat(length)}**
 * ${info} *
 **${'*'.repeat(length)}**/

`.trimLeft();

const inputOptions = {
  input,
  plugins: [
    urlResolve(),
    prettier({
      parser: 'babel',
      printWidth: 72,
      singleQuote: true,
      trailingComma: 'es5',
    }),
  ],
};

const outputOptions = {
  banner,
  file,
  format: 'esm',
};

async function build() {
  const bundle = await rollup(inputOptions);

  await bundle.write(outputOptions);

  console.info('Done');
}

build();
