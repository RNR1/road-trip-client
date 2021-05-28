import preprocess from 'svelte-preprocess';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import node from '@sveltejs/adapter-node';

const src = resolve('./src');
const pkg = JSON.parse(readFileSync(new URL('package.json', import.meta.url), 'utf8'));

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),
	kit: {
		adapter: node(),
		target: '#svelte',
		vite: {
			ssr: {
				noExternal: Object.keys(pkg.dependencies || {})
			},
			resolve: {
				alias: {
					$app: `${src}`,
					$api: `${src}/api`,
					$components: `${src}/components`,
					$routes: `${src}/routes`,
					$utils: `${src}/utils`,
					$typings: `${src}/typings`
				}
			}
		}
	}
};

export default config;
