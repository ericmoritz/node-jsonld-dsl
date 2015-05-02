const expect = require('expect')
const Immutable = require('immutable')
const List = Immutable.List
const DSL = require('../src/jsonld-dsl')
const URI = DSL.URI
const Namespace = DSL.Namespace
const Class = DSL.Class
const Property = DSL.Property
const Prefix = DSL.Prefix
const Resource = DSL.Resource
const ListContainer = DSL.ListContainer
const Vocab = DSL.Vocab
const xhtml = Namespace(
  Property('up')
)

const schema = Namespace(
  Class('Thing'),
  Class('Blog'),
  Class('BlogPosting'),
  Property('name'),
  Property('url'),
  Property('blogPost', ListContainer),
  Property('articleBody')
)

const context = Resource(
  Prefix(
    'schema', 'http://schema.org/', schema, {'blogPost': {'@container': '@list'}}
  ),
  Prefix('xhtml', 'http://www.w3.org/1999/xhtml#', xhtml)
)

const vocab = Resource(
  Vocab(schema)
)

const index = Resource(
  {"@context": '/context.jsonld'},
  URI('/'),
  // It is a Thing
  schema.Thing(
    schema.url('http://eric.themoritzfamily.com/')
  ),
  // and a Blog
  schema.Blog(
    schema.blogPost([
      Resource(
        URI('/entries/hydra-lite.json'),
        // It is a Thing
        schema.Thing(
          schema.name('Hydra Lite'),
          schema.url('http://eric.themoritzfamily.com/hydra-lite.html')
        ),
        // and a BlogPosting
        schema.BlogPosting()
      )
    ])
  )
)

const entry = Resource(
  {"@context": '/context.jsonld'},
  URI('/entries/hydra-lite.json'),
  // It is a Thing
  schema.Thing(
    schema.name('Hydra Lite'),
    schema.url('http://eric.themoritzfamily.com/hydra-lite.html')    
  ),
  // And a BlogPosting
  schema.BlogPosting(
    schema.articleBody('This is the article body...')
  )
)


const urls = {
  '/context.jsonld': context.toJSON(),
  '/': index.toJSON(),
  '/entries/hydra-lite.json': entry.toJSON(),
}

it('should render the context correctly', () => {
  expect(
    urls['/context.jsonld']
  ).toEqual(
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
})

it('should render the index correctly', () => {
  expect(
    urls['/']
  ).toEqual(
      {
        "@context": "/context.jsonld",
        "@id": "/",
        "@type": ["Thing", "Blog"],
        "url": "http://eric.themoritzfamily.com/",
        "blogPost": [
          {
            "@id": "/entries/hydra-lite.json",
            "@type": ["Thing", "BlogPosting"],
            "name": "Hydra Lite",
            "url": "http://eric.themoritzfamily.com/hydra-lite.html"
          }
        ]
      }
  )
})

it('should render the entry correctly', () => {
  expect(
    urls['/entries/hydra-lite.json']
  ).toEqual(
      {
        "@context": "/context.jsonld",
        "@id": "/entries/hydra-lite.json",
        "@type": ["Thing", "BlogPosting"],
        "name": "Hydra Lite",
        "url": "http://eric.themoritzfamily.com/hydra-lite.html",
        "articleBody": "This is the article body..."
      }
  )
})
