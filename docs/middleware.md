# Middleware #
It's possible to add middleware into 3 parts of your API:
- Middleware for all your api (this means all routes from ```/api/**/*```)
```js
// file: nuxt.config.js
{
  modules: [
    ['nuxt-neo', {
      // ...
      middleware: [
        function (req, res, next) {
            console.log('first');
            next()
        },
        function (req, res, next) {
            if (req.query.fail === 'true') {
                return res.status(500).send();
            }
                      
            next();
        }
      ]
      // ...
    }]
  ]
}
```

- Middleware for a controller (this means that all routes of the controller).

```js
// file: ~/api/todos.js

class TodoController {
    // ...
}

TodoController.ROUTES = {
    //...
};

TodoController.MIDDLEWARE = [
    function (req, res, next) {
        console.log('second');
        next();
    }
]
```
- Middleware for a specific action in a controller.
```js
//file: ~/api/todos.js

class TodoController {
    // ...
}

TodoController.ROUTES = {
    //...
};

TodoController.MIDDLEWARE = [
    ['allAction',
     function (req, res, next) {
         console.log('second');
         next();
     },
     function (req, res, next) {
         console.log('third');
         next();
     }
    ]
]
```