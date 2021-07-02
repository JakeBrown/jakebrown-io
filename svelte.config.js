import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';
import netlify from '@sveltejs/adapter-netlify';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    extensions: ['.svelte', ...mdsvexConfig.extensions],

    // Consult https://github.com/sveltejs/svelte-preprocess
    // for more information about preprocessors
    preprocess: [
        preprocess({
            postcss: true
        }),
        mdsvex(mdsvexConfig)
    ],

    kit: {
        // hydrate the <div id="svelte"> element in src/app.html
        adapter: netlify(),
        target: '#svelte'
    }
};

export default config;
