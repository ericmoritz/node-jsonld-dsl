var Graph = require('../src/graph')
var hydraLite = require('../src/hydraLite')
var expect = require('expect')


describe('Graph', function() {

  describe('#prefix', function() {
    it('should work', function() {
      var graph = Graph()

      graph.prefix({
        'hydra': 'http://www.w3.org/ns/hydra/core#',
      })

      expect(graph.context.toJSON()).toEqual(
        {
          'hydra': 'http://www.w3.org/ns/hydra/core#',
        }
      )

      graph.prefix({
        'schema': 'http://schema.org/',
      })

      expect(graph.context.toJSON()).toEqual(
        {
          'hydra': 'http://www.w3.org/ns/hydra/core#',
          'schema': 'http://schema.org/'
        }
      )
    })
  })


  describe('#declareClass', function() {
    var graph = Graph()

    graph.prefix({
      'hydra': 'http://www.w3.org/ns/hydra/core#'
    })

    graph.declareClass('Resource', 'hydra:Resource') 

    it("should update the context correctly", function() {
     
      expect(graph.context.toJSON()).toEqual(
        {
          'hydra': 'http://www.w3.org/ns/hydra/core#',
          'Resource': 'hydra:Resource',
        }
      )
    })

    it("should render the resource correctly", function() {
      var resource = graph.ns.Resource(
        graph.id('/')
      )

      expect(resource.toJSON()).toEqual(
        {
          '@id': '/',
          '@type': ['Resource'],
        }
      )
    })
  })

  describe('#declareProperty', function() {
    var graph = Graph()

    graph.prefix({
      'hydra': 'http://www.w3.org/ns/hydra/core#',
    })

    graph.declareProperty('member', 'hydra:member')
    graph.declareProperty('description', 'hydra:description')

    it('should update the context correctly', function() {
      expect(graph.context.toJSON()).toEqual(
        {
          'hydra': 'http://www.w3.org/ns/hydra/core#',
          'member': 'hydra:member',
          'description': 'hydra:description'
        }
      )
    })

    it('should render a literal correctly', function() {
      var resource = graph.resource(
        graph.ns.description("This is a literal")
      )
      expect(resource.toJSON()).toEqual(
        {
          'description': 'This is a literal'
        }
      )
    })

    it('should render a link correctly', function() {
      var resource = graph.resource(
        graph.ns.member(
          graph.resource(
            graph.id('/test')
          )
        )
      )
      expect(resource.toJSON()).toEqual(
        {
          'member': {
            '@id': '/test'
          }
        }
      )
    })
  })

  describe('#vocab()', function() {
    var graph = Graph()
    graph.prefix(hydraLite.context)
    graph.prefix({
      'vocab': 'http://example.com/vocab#'
    })

    graph.declareClass(
      'Index', 'vocab:Index',
      hydraLite.ns.title('Index'),
      hydraLite.ns.description('This is the index page')
    )
    
    graph.declareProperty(
      'name', 'vocab:name',
      hydraLite.ns.title('name'),
      hydraLite.ns.description('This is the name property')
    )
    
    it('should render the vocabulary', function() {
      expect(graph.vocab.toJSON()).toEqual(
        {
          'supportedClass': [
            {
              '@id': 'Index',
              'title': 'Index',
              'description': 'This is the index page'
            }
          ],
          '@graph': [
            {
              '@id': 'name',
              'title': 'name',
              'description': 'This is the name property'
            }
          ]
        }
      )
    })
  })
})
