## Usage

```js

// First declare your namespace
var NS = require('namespace')
var Class = NS.Class
var Property = NS.Property
var URI = NS.Property
var Namespace = NS.Namespace
var Prefix = NS.Prefix

var blog = Namespace(
    Class('Index')
    Class('Entry')
    Property('entries'),
    Property('title')
)

var index = blog.Index(
  Prefix('blog', 'http://example.com/blog#', blog),
  URI('/')
  blog.entries([
    blog.Entry(
      URI('/entries/1'),
      {'title': 'Entry #1'} // supports native objects
    )
  ])
)

/*
{
  "@context": {
    "blog": "http://example.com/blog#",
    "Index": "blog:Index",
    "Entry": "blog:Entry",
    "entries": "blog:entries",
    "title": "blog:title"
  },
  "@id": "/",
  "@type": ["Index"],
  "entries": [
    {
      "@id": "/entries/1",
      "@type": ["Entry"],
      "title": "Entry #1"
    }
  ]
}
*/

```
