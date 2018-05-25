# nuxt-neo
[![Build Status](https://travis-ci.org/ezypeeze/nuxt-neo.svg?branch=master)](https://travis-ci.org/ezypeeze/nuxt-neo)
[![Dependencies](https://david-dm.org/ezypeeze/nuxt-neo.svg)](https://david-dm.org/ezypeeze/nuxt-neo.svg)

> This module allows you to make a middleware API between the browser, your server and other private API's. Opinated, yet flexible, you can take care of your data flow in the same way, no matter if you are executing code on server or client side.

### Description ###
One of the things that Nuxt.js doesn't bring out-of-the-box is middleware api support
(it can be simply added thanks to its flexibility).
I created this module so you can create your API inside nuxt.js easily, based on a controllers and actions approach.

### Features ###
- Auto-generate routes based on the folder/file tree your api folder.
- Easy middleware injection (for all API or controller/action specific)
- One single way to access your API.
- Vue/Nuxt helpers to ease-up data flow access.
- Lazy-loaded services layer per request, where your controllers can access.
- Global HTTP Errors for better error handling
 
### License ###
MIT
