# node-jsonld-dsl

This is a DSL for building JSON-LD powered hypermedia services. This
module will serve as the view layer for a service.

Building JSON-LD services by hand often leads to inconsistencies between
the context and the resources that is hard to detect.

This DSL will help you build JSON-LD services that keep their
context's consistent.

## Namespace



```js
var DSL = require("jsonld-dsl")
var Namespace = DSL.Namespace
var URI = DSL.URI
var Resources = DSL.Resources

var xhtml = Namespace(
  Property('up')
)

var schema = Namespace(
  Class('Thing'),
  Class('Blog'),
  Class('BlogPosting'),
  Property('name'),
  Property('url'),
  Property('blogPost', ListContainer),
  Property('articleBody')
)
```

This schema allows you to declare the classes and properties that your
resources will use.

To generate a BlogPost resource is easy:

```js
var entry = schema.BlogPosting(
  URI('/entries/hydra-lite.json'),
  schema.BlogPosting(
    schema.name('Hydra Lite'),
    schema.url('http://eric.themoritzfamily.com/hydra-lite.html')    
    schema.articleBody('This is the article body...')
  )
)
```

This will produce a
[Immutable.Map()](http://facebook.github.io/immutable-js/docs/#/Map)
instance that represents your resource.

The result of `JSON.stringify(entry)` would be:

```json
{
  "@id": "/entries/hydra-lite.json",
  "@type": ["BlogPosting"],
  "name": "Hydra Lite",
  "url": "http://eric.themoritzfamily.com/hydra-lite.html",
  "articleBody": "This is the article body..."
}
```

The use of `Immutable.Map()` allows us to easily and efficiently
compose resources together:


`Resource()` allows us render a resource that is the composition
of `schema.Thing()` and  `schema.BlogPosting()` resources.

Rendered as JSON-LD, this is a really minor change:

```json
{
  "@id": "/entries/hydra-lite.json",
  "@type": ["Thing", "BlogPosting"],
  "name": "Hydra Lite",
  "url": "http://eric.themoritzfamily.com/hydra-lite.html",
  "articleBody": "This is the article body..."
}
```

Did you notice the difference? That's right, it simply addes 
`"Thing"` to the `@type` field.

## Context

You have two choices when it comes to a JSON-LD you can embed the
context or you can refer to it as a URL.

Let us start with how you would render a context resource:

```js
var context =  Resource(
  Prefix(
    'schema',                             // namespace prefix
    'http://schema.org/',                 // namespace URI
    schema,                               // namespace
    {'blogPost': {'@container': '@list'}} // optional @context overlay
  ),
  Prefix('xhtml', 'http://www.w3.org/1999/xhtml#', xhtml)
)
```

As JSON this `context` will look like:

```json
{
  '@context': {
    'rdfs': 'http://www.w3.org/2000/01/rdf-schema#',
    'Blog': 'schema:Blog',
    'BlogPosting': 'schema:BlogPosting',
    'Thing': 'schema:Thing',
    'articleBody': 'schema:articleBody',
    'blogPost': {'@id': 'schema:blogPost', '@container': '@list'},
    'name': 'schema:name',
    'schema': 'http://schema.org/',
    'up': 'xhtml:up',
    'url': 'schema:url',
    'xhtml': 'http://www.w3.org/1999/xhtml#',
  }
}
```

Resources can link to the context like so:

```js
var entry = schema.BlogPosting(
  {'@context': '/context.jsonld'},
  URI('/entries/hydra-lite.json'),
  schema.BlogPosting(
    schema.name('Hydra Lite'),
    schema.url('http://eric.themoritzfamily.com/hydra-lite.html')    
    schema.articleBody('This is the article body...')
  )
)
```

To embed the context, this is really simple:

```js
var entry = schema.BlogPosting(
  context,
  URI('/entries/hydra-lite.json'),
  schema.BlogPosting(
    schema.name('Hydra Lite'),
    schema.url('http://eric.themoritzfamily.com/hydra-lite.html')    
    schema.articleBody('This is the article body...')
  )
)
```

## Vocabulary

If you need to automatically generate a vocabulary for your service,
this couldn't be any simplier:

```js
var vocab = DSL.Vocab(
    schema,
    xhtml
)
```

The JSON would look like:

```json
{
  "@graph": [
    {
      "@id": "Thing",
      "@type": ["rdfs:Class"]
    },
    {
      "@id": "Blog",
      "@type": ["rdfs:Class"]
    },
    {
      "@id": "BlogPosting",
      "@type": ["rdfs:Class"]
    },
    {
      "@id": "name",
      "@type": ["rdfs:Property"]
    },
    {
      "@id": "url",
      "@type": ["rdfs:Property"]
    },
    {
      "@id": "blogPost",
      "@type": ["rdfs:Property"]
    },
    {
      "@id": "articleBody",
      "@type": ["rdfs:Property"]
    },
    {
      "@id": "up",
      "@type": ["rdfs:Property"]
    }
  ]
}
```

## Annotating your Properties and Classes

`Proprety()` and `Class()` results are `Resources()`
like any other so they allow you to annotate them just like any other
resource

```

var rdfs = Namespace(
  Property('comment')
  Property('range')
)

var hydra = Namespace(
  Class('Link')
)
var ns = Namespace(
  Class('SearchResults'),
  Property(
    'search',
    hydra.Link(),
    rdfs.comment('This is the search link'),
    rdfs.range(URI('SearchResults'))
  )
)
```

In the vocabulary the `search` property will look like:

