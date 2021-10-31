# Getting Started

## Basic setup

```bash
yarn add nuxt-neo --save
```

Or NPM:

```bash
npm i nuxt-neo --save
```

Then add the module to `nuxt.config.js`:

```js
{
  modules: [
    ['nuxt-neo', {
      // Options
    }]
  ]
}

// or alternatively:

{
  modules: [
    'nuxt-neo'
  ],
  nuxtNeo: {
    // Options
  }
}
```

## Typescript Types

To enable type validation for the module options and extend Vue and Nuxt interfaces (make them aware of the `$api` and global API errors), add `"nuxt-neo"` entry to the `types` array in `tsconfig.json`. For example a minimal configuration file could look like:

```json
{
    "compilerOptions": {
        "baseUrl": ".",
        "target": "ES2020",
        "module": "ES2020",
        "noEmit": true,
        "moduleResolution": "node",
        "types": [
          "@nuxt/types",
          "nuxt-neo"
        ]
    },
}
```
