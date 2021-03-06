// # jsonld-dsl

// [jsonld-dsl](http://github.com/ericmoritz/node-jsonld-dsl/) is a
// DSL for building JSON-LD powered hypermedia services. This module
// will serve as the view layer for a service.

// Building JSON-LD services by hand often leads to inconsistencies
// between the context and the resources that is hard to detect.

// This DSL will help you build JSON-LD services that keep their
// context's consistent.
import expect from 'expect'
import {DSL, URI, Namespace, Class, Property, Prefix, Resource, Vocab} from 'jsonld-dsl'


// ## Namespace
//
// First, we'll look at how to declare a namespace for your service.
//
const xhtml = Namespace(
  Property('up')
)

const schema = Namespace(
  Class('Thing'),
  Class('Blog'),
  Class('BlogPosting'),
  Property('name'),
  Property('url'),
  Property('blogPost'),
  Property('articleBody')
)

it(
  'should produce a Immutable.Map() of the BlogPosting() resource',
  () => {
    expect(

//
// This schema allows you to declare the classes and properties that
// your resources will use.
//
// To generate a BlogPost resource is easy:
//
      schema.BlogPosting(
        URI('/entries/hydra-lite.json'),
        schema.name('Hydra Lite'),
        schema.url('http://eric.themoritzfamily.com/hydra-lite.html'),
        schema.articleBody('This is the article body...')
      ).toJSON()

    ).toEqual(
//
// This will produce a `ResourceClass` instance which is a sub-class of
// [Immutable.Map()](http://facebook.github.io/immutable-js/docs/#/Map)
// instance that represents your resource.
//
      {
        "@id": "/entries/hydra-lite.json",
        "@type": ["BlogPosting"],
        "name": "Hydra Lite",
        "url": "http://eric.themoritzfamily.com/hydra-lite.html",
        "articleBody": "This is the article body..."
      }
    )
  }
)
//
// Because of the `Immutable.Map#toJSON` method, rendering
// the resource as JSON is as easy as calling `JSON.stringify(entry)`
//
// The use of `Immutable.Map()` allows us to easily and efficiently
// compose resources together. Any instance of a `ResourceClass` can
// be composed with `Resource()`
//

it(
  'Resource() allows you to compose class instances into a single resource',
  () => {
    expect(
//
// `Resource()` allows us render a resource that is the composition
// multiple properties and classes.
//
// For instance to compose a resource of a `schema.Thing()` and
// a `schema.BlogPosting()`. You would do the following
//
      Resource(
        URI('/entries/hydra-lite.json'),
        schema.Thing(
          schema.name('Hydra Lite'),
          schema.url(
            'http://eric.themoritzfamily.com/hydra-lite.html'
          )    
        ),
        schema.BlogPosting(
          schema.articleBody('This is the article body...')
        )
      ).toJSON()
    ).toEqual(
//
// Rendered as JSON-LD, this is a really minor change:
//
      {
        "@id": "/entries/hydra-lite.json",
        "@type": ["Thing", "BlogPosting"],
        "name": "Hydra Lite",
        "url": "http://eric.themoritzfamily.com/hydra-lite.html",
        "articleBody": "This is the article body..."
      }
    )
  }
//
// Did you notice the difference? That's right, it simply adds 
// `"Thing"` to the `@type` field.
//
)

//
// ## Context
//
//
it('should render a context correctly', () => {
//
// You have two options when it comes to a JSON-LD you can embed the
// context or you can refer to it as a URL.
// 
// Let us start with how you would render a context resource:
//
//
  let context = Resource(
    Prefix(
// This is the namespace's prefix.
      'schema',                             
// This is the namespace's URI
      'http://schema.org/',                 
      schema,                               
// This is an optional context overlay
      {'blogPost': {'@container': '@list'}} 
    ),
    Prefix('xhtml', 'http://www.w3.org/1999/xhtml#', xhtml)
  )

  expect(
    context.toJSON()
  ).toEqual(
// As JSON this `context` will look like:
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
  )


  expect(
// Resources can then link to the context like so:
    schema.BlogPosting(
      {'@context': '/context.jsonld'},
      URI('/entries/hydra-lite.json'),
      schema.BlogPosting(
        schema.name('Hydra Lite'),
        schema.url(
          'http://eric.themoritzfamily.com/hydra-lite.html'
        ),
        schema.articleBody('This is the article body...')
      )
    ).toJSON()
  ).toEqual(
// Which will result in JSON that looks like so
      {
        "@context": "/context.jsonld",
        "@id": "/entries/hydra-lite.json",
        "@type": ["BlogPosting"],
        "name": "Hydra Lite",
        "url": "http://eric.themoritzfamily.com/hydra-lite.html",
        "articleBody": "This is the article body..."
      }
  )

  expect(
// To Embed the context, this is really simple:
    schema.BlogPosting(
      context,
      URI('/entries/hydra-lite.json'),
      schema.BlogPosting(
        schema.name('Hydra Lite'),
        schema.url(
          'http://eric.themoritzfamily.com/hydra-lite.html'
        ),
        schema.articleBody('This is the article body...')
      )
    ).toJSON()
  ).toEqual(
//
// This results in JSON that looks like so:
//
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
      },
      "@id": "/entries/hydra-lite.json",
      "@type": ["BlogPosting"],
      "name": "Hydra Lite",
      "url": "http://eric.themoritzfamily.com/hydra-lite.html",
      "articleBody": "This is the article body..."
    }
  )
})


// ## Vocabulary
//
it('should render a vocabulary correctly', () => {
  expect(
    //
    // If you need to automatically generate a vocabulary for your
    // service, this couldn't be any simpler:
    //
    Vocab(schema, xhtml).toJSON()
  ).toEqual(
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
  )
})

//
// ## Annotating your Properties and Classes
//
it('should allow annotation of Property and Classes', () => {
  
// `Property()` and `Class()` results are `Resources()` like any other
// so they allow you to annotate them just like any other resource

  let rdfs = Namespace(
    Property('comment'),
    Property('range')
  )

  let hydra = Namespace(
    Class('Link')
  )

  let ns = Namespace(
    Class('SearchResults'),
    Property(
      'search',
      hydra.Link(),
      rdfs.comment('This is the search link'),
      rdfs.range(URI('SearchResults'))
    )
  )

  expect(
//
// The vocabulary of this namespace will include these annotations
//
    Resource(
      Prefix('rdfs', 'http://www.w3.org/2000/01/rdf-schema#', rdfs),
      Prefix('hydra', 'http://www.w3.org/ns/hydra/core#', hydra),
      Prefix('ns', 'http://example.com/vocab#', ns),
      Vocab(ns)
    ).toJSON()
  ).toEqual(
    {
      "@context": {
        "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
        "comment": "rdfs:comment",
        "range": "rdfs:range",
        "hydra": "http://www.w3.org/ns/hydra/core#",
        "Link": "hydra:Link",
        "SearchResults": "ns:SearchResults",
        "search": "ns:search",
        "ns": "http://example.com/vocab#"
      },
      "@graph": [
        {
          "@id": "SearchResults",
          "@type": ["rdfs:Class"]
        },
//
// The search property is a `Link` as well as a `rdfs:Property`
//
        {
          "@id": "search",
          "@type": ["rdfs:Property", "Link"],
          "comment": "This is the search link",
          "range": { "@id": "SearchResults"}
        }
      ]
    }
  )
})

// # hydra support
import {hydra} from 'jsonld-dsl'

// hydra is a part of the jsonld-dsl module.  It defines
// all the hydra classes and properties for you

// For instance, here is a hydra collection that
// has POST, PUT, and DELETE operations declared
it('allows you to add hydra properties and classes', () => {
  expect(
    Resource(
      schema.Blog(),
      hydra.POST(
        hydra.statusCode([303, 400]),
        hydra.expects('BlogPosting')
      ),
      hydra.Collection(
        hydra.member([
          Resource(
            URI('/entries/hydra-lite.json'),
            hydra.PUT(
              hydra.statusCode([204, 400]),
              hydra.expects('BlogPosting')
            ),
            hydra.DELETE(),
            schema.Thing(
              schema.name('Hydra Lite'),
              schema.url('http://eric.themoritzfamily.com/hydra-lite.html')    
            ),
            schema.BlogPosting(
              schema.articleBody('This is the article body...')
            )
          )
        ])
      )
    ).toJSON()
  ).toEqual(
    {
      '@type': ['Blog', 'Collection'],
      'operation': [
        {'@type': ['Operation'], 'method': 'POST', 'expects': 'BlogPosting', 'statusCode': [303, 400]}
      ],
      'member': [
        {
          '@id': '/entries/hydra-lite.json',
          'operation': [
            {'@type': ['Operation'], 'method': 'PUT', 'expects': 'BlogPosting', 'statusCode': [204, 400]},
            {'@type': ['Operation'], 'method': 'DELETE'}            
          ],
          '@type': ['Thing', 'BlogPosting'],
          'articleBody': 'This is the article body...',
          'name': 'Hydra Lite',
          'url': 'http://eric.themoritzfamily.com/hydra-lite.html'
        }
      ]
    }
  )
})
