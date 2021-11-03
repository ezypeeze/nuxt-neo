# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [4.3.0](https://github.com/ezypeeze/nuxt-neo/compare/v4.2.1...v4.3.0) (2021-11-03)


### Features

* **types:** add types for the module configuration and api ([#37](https://github.com/ezypeeze/nuxt-neo/issues/37)) ([6105698](https://github.com/ezypeeze/nuxt-neo/commit/61056982c35fc3491293feb0bbfda0b7dbf447c4))


### Bug Fixes

* allow using ES imports syntax in the controllers ([#15](https://github.com/ezypeeze/nuxt-neo/issues/15)) ([3af9aad](https://github.com/ezypeeze/nuxt-neo/commit/3af9aad3371e792ae8004d4a41c28e78819f63b5)), closes [#12](https://github.com/ezypeeze/nuxt-neo/issues/12)
* support passing options through nuxtNeo property ([#33](https://github.com/ezypeeze/nuxt-neo/issues/33)) ([77700dc](https://github.com/ezypeeze/nuxt-neo/commit/77700dc7e1deb2fed0fac395e7bbdebc903b9182))

### [4.2.1](https://github.com/ezypeeze/nuxt-neo/compare/v4.2.0...v4.2.1) (2021-10-25)


### Bug Fixes

* remove unused "config" dependency ([#13](https://github.com/ezypeeze/nuxt-neo/issues/13)) ([7f7431a](https://github.com/ezypeeze/nuxt-neo/commit/7f7431a98467c70cfcd495dae65fbbe80de43f11))

## [4.2.0](https://github.com/ezypeeze/nuxt-neo/compare/v4.1.0...v4.2.0) (2020-07-10)


### Features

* **extendRouter:** add config to allow to extend router, since middleware doesn't has access to res/next object ([e2e6cba](https://github.com/ezypeeze/nuxt-neo/commit/e2e6cba3ad9afbf755abeffb4dce0b8f08f4f207))

## [4.1.0](https://github.com/ezypeeze/nuxt-neo/compare/v4.0.0...v4.1.0) (2020-06-30)

### Features


### Bug Fixes

* **issue #10:** Promise.catch() in plugins.api.template.js ([2b7f053](https://github.com/ezypeeze/nuxt-neo/commit/2b7f053bc4c7f6935abb3298f2be69007e3c1a46)), closes [#10](https://github.com/ezypeeze/nuxt-neo/issues/10)
* fix middleware handler not being sequencially ran

### Refactor

* add action middleware into Controller.ROUTES[middleware].middleware (deprecated from old way Controller.MIDDLEWARE) - controller middleware remains the same

### Other

* upgrade dependencies for latest and stable available

## [4.0.0](https://github.com/ezypeeze/nuxt-neo/compare/v3.0.2...v4.0.0) (2019-09-09)


### Features

* **error handler:** pass entire context nuxt object instead of only the error nuxt handler ([ce0f598](https://github.com/ezypeeze/nuxt-neo/commit/ce0f598))


### BREAKING CHANGES

* **error handler:** errorHandler will only have one parameter (of type Error) with the err.ctx object monkey-patched



### [3.0.2](https://github.com/ezypeeze/nuxt-neo/compare/v3.0.1...v3.0.2) (2019-07-03)


### Bug Fixes

* error responses were passed as resolved instead of catched if no errorHandler option was passed, also errorHandler was never passed to the client-side api ([07deb3e](https://github.com/ezypeeze/nuxt-neo/commit/07deb3e))



## [3.0.1](https://github.com/ezypeeze/nuxt-neo/compare/v3.0.0...v3.0.1) (2019-03-28)


### Bug Fixes

* revert the url.URL change due eslint suggestion ([eebdb70](https://github.com/ezypeeze/nuxt-neo/commit/eebdb70))



# [3.0.0](https://github.com/ezypeeze/nuxt-neo/compare/v2.0.2...v3.0.0) (2019-03-28)

### Feature
* support both client and server side success and error handlers
* add nuxt error page function resolver as errorHandler parameter
* add http error classes both on server and client side

### Bug Fixes
* convert camelCase controller file name to dash case (for route url's endpoint)
 
### Other
* upgrade devDependencies (including nuxt)

### BREAKING CHANGES
* **responseMiddleware** is now called **successHandler** (**successHandler** function was removed) (used both on client and server side)
* **errorHandler** is now a string (file path), instead of a function (used both on client and server side)
* **successResponse** was renamed to serverSuccessResponse
* **errorResponse** was renamed to **serverErrorResponse**
* **notFoundRouteResponse** was renamed to **serverNotFoundRouteResponse**



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
