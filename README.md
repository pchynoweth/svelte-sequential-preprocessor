![Node.js CI](https://github.com/pchynoweth/svelte-sequential-preprocessor/workflows/Node.js%20CI/badge.svg)
![new-version](https://github.com/pchynoweth/svelte-sequential-preprocessor/workflows/new-version/badge.svg)
[![version](https://img.shields.io/npm/v/svelte-sequential-preprocessor.svg?style=flat-square)](http://npm.im/svelte-sequential-preprocessor)

# svelte-sequential-preprocessor

> A [Svelte](https://svelte.dev) preprocessor that wraps preprocessors to force them to be called sequentially.

## Overview

Svelte evaluates preprocessors by running all markup preprocessors first, then script and finally styles.  Some preprocesses may not work if other preprocessors haven't been run.  For example, [svelte-image](https://github.com/matyunya/svelte-image) uses `svelte.parse()` internally, so [svelte-preprocess](https://github.com/sveltejs/svelte-preprocess) needs to be run before if any scss is present.

## :warning: Deprecation Notice :warning:

Since Svelte 4 this has been the default behaviour. I plan to continue to apply package updates periodically to apply security updates, but please migrate away from this package when you can.

More details of the Svelte implementation can be found here:

* Svelte 4 Migration Guide - https://gist.github.com/dummdidumm/29dd14d0fb1930f38819bf01641ee6bb#14-preprocessors
* Pull request where the behaviour was changed - https://github.com/sveltejs/svelte/pull/8618#issue-1722223598

I would like to take this opportunity to thank everyone for your support over the years.  If there is any use case this package is still needed for, please raise an issue, and I will consider keeping the project alive a bit longer. 

## Installation

Using npm:
```bash
$ npm i -D svelte-sequential-preprocessor
```

## Usage

### With `rollup-plugin-svelte`

```js
// rollup.config.js
import svelte from 'rollup-plugin-svelte';
import seqPreprocessor from 'svelte-sequential-preprocessor'
import autoPreprocess from 'svelte-preprocess'
import image from 'svelte-image'

export default {
  ...,
  plugins: [
    svelte({
      preprocess: seqPreprocessor([ autoPreprocess(), image() ])
    })
  ]
}
```

### With `svelte-loader`

```js
  ...
  module: {
    rules: [
      ...
      {
        test: /\.(html|svelte)$/,
        exclude: /node_modules/,
        use: {
          loader: 'svelte-loader',
          options: {
            preprocess: require('svelte-sequential-preprocessor')([ require('svelte-preprocess'), require('svelte-image')])
          },
        },
      },
      ...
    ]
  }
  ...
```

### With SvelteKit

```js
// svelte.config.js
import adapter from '@sveltejs/adapter-auto';
import seqPreprocessor from 'svelte-sequential-preprocessor';
import autoPreprocess from 'svelte-preprocess';
import image from 'svelte-image';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: seqPreprocessor([autoPreprocess(), image()]),

  kit: {
    adapter: adapter()
  }
};

export default config;
```
