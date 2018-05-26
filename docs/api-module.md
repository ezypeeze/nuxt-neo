# API Module #

## Configuration ##
The default options of the api module are:

```js
api: {
    // api folder tree directory -- required
    directory: __dirname + '/api', 
    
    // api prefix path
    prefix: '/api', 
    
    // globalize http error classes (BadRequestError, NotFoundError, ...)
    httpErrors: true, 
    
     // debug mode - detailed internal server errors response, with stack, etc...
    debug: process.env.NODE_ENV !== 'production',
    
    // If controller action return is null/empty, return 204 No Content
    noContentStatusOnEmpty: true,
    
    // Client side http request handler -- required
    clientSideApiHandler: '~/api_handler',
    
    // Middleware handlers for all your api.
    middleware: [],
    
    // Success Handler - used to adjust your api response strucuture
    successHandler: function (result) {
        return result;
    },
    
    // Success Response handler - will decide how the data will be send (as json, xml, etc..)
    successResponse: function (req, res, options) {
        if (!res.result && options.noContentStatusOnEmpty) {
            return res.status(204).send();
        }

        return res.status(200).json(res.result);
    },
    
    // Error Handler - used to decide how the error will be handle before sending the response
    // can be used to, for example, to send logs to some provider
    errorHandler: function (err) {
        throw err;
    },
    
    // Error Response handler - will decide how the error will be send to the client
    errorResponse: function (err, req, res, options) {
        if (err && err.statusCode) {
            return res.status(err.statusCode).json({
                message: err.message,
                errors: err.errors
            });
        }

        // If in debug mode, show the error message and stack trace.
        if (options.debug) {
            return res.status(500).json({
                message: err.message,
                trace: err.stack.split('\n')
            });
        }

        return res.status(500).json({
            message: 'An internal error has occurred'
        });
    },
    
    // In case the route wasn't found,  will decide what to send to the client
    notFoundRouteResponse: function (req, res) {
            return res.status(404).json({message: 'Route not found'});
    }
}
```

## Middleware ##
It's possible to add middleware into 3 parts of your API:
- Middleware for all your api (this means all routes from ```/api/**/*```)
```js
// file: nuxt.config.js
{
  modules: [
    ['nuxt-neo', {
      api: {
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
      },
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

## Error Handling ##
Imagine that you have some kind of validation you want to perform before creating a new todo:
```js
    // An object is passed to all actions, with the route params, query string and body.
    async createAction({params, query, body}) {
        if (!body.title || !body.content) {
            throw new BadRequestError('Invalid body payload', [
                !body.title && 'Title is required',
                !body.content && 'Content is required'
            ].filter(Boolean));    
        }
        
        return await Todos.create(body.title, body.content);
    }
```

Or in case you fetch a todo by id and it doesn't exist:
```js
    // An object is passed to all actions, with the route params, query string and body.
    async getAction({params}) {
        const todo = await Todos.fetchById(params.id);
        if (!todo) {
            throw new NotFoundError(`Todo "${params.id}" doesn't exist.`)
        }
                
        return todo;
    }
```

- By default, ```nuxt-neo``` globalizes what we call ```http errors/exceptions```. Those exceptions,
are a kind of error that is a request flow error (route not found, bad request payload, reserved/private areas).
If an ```http errors/exceptions``` is throwed, a special kind of response will be sent 
(e.g bad request will send a list of errors, not found will represent that a given id todo doesn't exist, ...).

**NOTE**: You are not required to use this, you can simply throw a normal error (```Error native class```), its simply a
nice-to-have way to organize your error handling. If you don't want this classes you can simply disable it doing:
```js
{
  modules: [
    ['nuxt-neo', {
      api: {
          // ...
          httpErrors: false // disable http global error classes
          // ...
      },
    }]
  ]
}
```