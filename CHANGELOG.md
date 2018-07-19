# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="2.0.2"></a>
## [2.0.2](https://github.com/ezypeeze/nuxt-neo/compare/v2.0.1...v2.0.2) (2018-07-19)


### Bug Fixes

* **directory:** finally resolving directory alias ([293ac70](https://github.com/ezypeeze/nuxt-neo/commit/293ac70))



<a name="2.0.1"></a>
## [2.0.1](https://github.com/ezypeeze/nuxt-neo/compare/v2.0.0...v2.0.1) (2018-07-19)


### Bug Fixes

* **directory:** resolve nuxt alias key directory for api ([ca9a8d4](https://github.com/ezypeeze/nuxt-neo/commit/ca9a8d4))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/ezypeeze/nuxt-neo/compare/v1.3.0...v2.0.0) (2018-07-16)


### Features

* **middleware:** change middleware flow to make it more enrich/error based ([db639dd](https://github.com/ezypeeze/nuxt-neo/commit/db639dd))

### Breaking Changes
- Middlewares changed behaviour to be able to work both client and server side. Check the documentation.


<a name="1.3.0"></a>
# [1.3.0](https://github.com/ezypeeze/nuxt-neo/compare/v1.2.1...v1.3.0) (2018-07-03)
### Features
* **feat(clientSideApiHandler):** add app object (root vue instance) in clientSideApiHandler param.


<a name="1.2.1"></a>
## [1.2.1](https://github.com/ezypeeze/nuxt-neo/compare/v1.2.0...v1.2.1) (2018-06-12)


### Bug Fixes

* make  calls on server and client side arguments uniform. ([411ef11](https://github.com/ezypeeze/nuxt-neo/commit/411ef11))



<a name="1.2.0"></a>
# [1.2.0](https://github.com/ezypeeze/nuxt-neo/compare/v1.1.0...v1.2.0) (2018-06-12)


### Features

* **bodyParsers:** add body parsers middleware option (using express/body-parsers lib or custom handler). [#1](https://github.com/ezypeeze/nuxt-neo/issues/1) ([e9cb273](https://github.com/ezypeeze/nuxt-neo/commit/e9cb273))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/ezypeeze/nuxt-neo/compare/v1.0.2...v1.1.0) (2018-06-06)


### Features

* **responseMiddleware:** add responseMiddleware (both client and server side) to perform actions to payload, uniformly ([b5083b5](https://github.com/ezypeeze/nuxt-neo/commit/b5083b5))



<a name="1.0.2"></a>
## [1.0.2](https://github.com/ezypeeze/nuxt-neo/compare/v1.0.1...v1.0.2) (2018-06-04)
### Bug Fixes
* arguments call of controllers tree functions in client side ([dc558b4](https://github.com/ezypeeze/nuxt-neo/commit/dc558b4))

<a name="1.0.1"></a>
## [1.0.1](https://github.com/ezypeeze/nuxt-neo/compare/v1.0.0...v1.0.1) (2018-05-28)
### Bug Fixes
* Error response handler handles now the proper error, instead of moving to nuxt error handling. ([17b1974](https://github.com/ezypeeze/nuxt-neo/commit/17b1974))
* Fixed docs basic-usage.md (add two 'export default' on client side api handler example) ([ba06cdf](https://github.com/ezypeeze/nuxt-neo/commit/ba06cdf))

<a name="1.0.0"></a>
## [1.0.0](https://github.com/ezypeeze/nuxt-neo/compare/v0.0.5...v1.0.0) (2018-05-28)
* Removed Services Module
* Removed submodules configuration.
* This package will take care only of the API initialization and access both from client and server side
* Updated documentation

<a name="0.0.4"></a>
## [0.0.4](https://github.com/ezypeeze/nuxt-neo/compare/v0.0.3...v0.0.4) (2018-05-26)
* Services are disabled by default
* Removed ```asyncData``` and ```fetch``` helpers (now vue js root instance has $api injected (a.k.a app key))
* Controller tree is generated on every request
* Updated documentation

<a name="0.0.3"></a>
## [0.0.3](https://github.com/ezypeeze/nuxt-neo/compare/v0.0.2...v0.0.3) (2018-05-14)
* Minor updates.

<a name="0.0.2"></a>
## [0.0.2](https://github.com/ezypeeze/nuxt-neo/compare/v0.0.1...v0.0.2) (2018-05-14)
* Minor updates. Documentation.

<a name="0.0.1"></a>
## [0.0.1](https://github.com/ezypeeze/nuxt-neo/releases/tag/v0.0.1) (2018-05-12)
* First release
