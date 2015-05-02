# jsonld-dsl

`jsonld-dsl` is a DSL for building JSON-LD powered hypermedia services.

* [documentation](https://ericmoritz.github.io/node-jsonld-dsl/)
* [npm](https://www.npmjs.com/package/jsonld-dsl)

```js
var schema = Namespace(
  Class('Thing'),
  Class('Blog'),
  Class('BlogPosting'),
  Property('name'),
  Property('url'),
  Property('blogPost'),
  Property('articleBody')
)

var post = schema.BlogPosting(
  URI('/entries/hydra-lite.json'),
  schema.BlogPosting(
    schema.name('Hydra Lite'),
    schema.url('http://eric.themoritzfamily.com/hydra-lite.html'),
    schema.articleBody('This is the article body...')
   )
)
```
