# Error Handling #

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
       // ...
       httpErrors: false // disable http global error classes
       // ...
    }]
  ]
}
```

## List of HTTP Error Exceptions ##
- BadRequestError (status = 400)
```js
new BadRequestError(message = 'Invalid Request', errors = ['Name not found'])
```
- UnauthorizedError (status = 401)
```js
new UnauthorizedError(message = 'No Session')
```
- ForbiddenError (status = 403)
```js
new ForbiddenError(message = 'No access to this area')
```
- NotFoundError (status = 404)
```js
new NotFoundError(message = 'The resource was not found')
```
- InternalServerError (status = 500)
```js
new InternalServerError(message = 'An internal error has occurred.')
```
