# nuxt-neo

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

### How it works ###
- You create a folder and assign it to be your api root folder (e.g: ~/api).
- Based on that folder/file tree, it will auto generate your routes:
    - Imagine with this folder structure:
        - ```~/api/users/index.js ```
        - ```~/api/users/categories/index.js ```
        - ```~/api/users/categories/types.js ```
        - ```~/api/products.js ```
    - The following route prefixes will be generated:
        - ```<api_prefix>/users ```
        - ```<api_prefix>/users/categories ```
        - ```<api_prefix>/users/categories/types ```
        - ```<api_prefix>/products ```
    - Each .js file will be your controller, which is a class.
    - A controller has a list of routes (its pretty much a resource).
    - A controller can have middleware for all the nested routes or per action.
- Optional: You create a folder and assign it to be your services root folder (e.g: ~/services).
    - Each file inside the services folder is a service class, that receives the request method.
    - a getService method is injected into request object, and you can simply call
     the service as ```getService('users')```
### License ###
MIT
