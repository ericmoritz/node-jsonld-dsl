import {Namespace, URI, Class, Property, type, Resource, Vocab, Context, Prefix} from '../src/jsonld-dsl'
import expect from 'expect'
import {Map, Set, List} from 'immutable'


describe('URI', () => {
  it('should create the correct map', () => {
    expect(
      URI('test').toJSON()
    ).toEqual(
      {
        '@id': 'test'
      }
    )
  })
})

describe('Vocab', () => {
  it('should create the correct map', () => {
    const ns1 = Namespace(
      Class('Class1'),
      Property('prop1')
    )

    const ns2 = Namespace(
      Class('Class2'),
      Property('prop2')
    )

    expect(
      Vocab(ns1, ns2).toJSON()
    ).toEqual(
      {
        '@graph': [
          {
            "@id": "Class1",
            "@type": ["rdfs:Class"]
          },
          {
            "@id": "prop1",
            "@type": ["rdfs:Property"]
          },
          {
            "@id": "Class2",
            "@type": ["rdfs:Class"]
          },
          {
            "@id": "prop2",
            "@type": ["rdfs:Property"]
          }
        ]
      }
    )
  })

  it('should support property supclassing', function() {
    let hydra = Namespace(
      Class('Link')
    )
    var search = Property('search', hydra.Link())

    expect(
      search.toJSON()
    ).toEqual(
      {
        '@id': 'search',
        '@type': ['rdfs:Property', 'Link']
      }
    )
  })
})


describe('type', () => {
  it('should create a type set', () => {
    expect(
      type('test').toJSON()
    ).toEqual(
      {
        '@type': ['test']
      }
    )
  })
})


describe('Class', () => {
  it('should create a Class resource', () => {
    expect(
      Class('TestClass').toJSON()
    ).toEqual(
      {
        '@id': 'TestClass',
        '@type': ['rdfs:Class']
      }
    )
  })
})


describe('Property', () => {
  it('should create a Property resource', () => {
    expect(
      Property('testProperty').toJSON()
    ).toEqual(
      {
        '@id': 'testProperty',
        '@type': ['rdfs:Property']
      }
    )
  })

  it('should allow additional properties', () => {
    expect(
      Property('testProperty').toJSON()
    ).toEqual(
      {
        '@id': 'testProperty',
        '@type': ['rdfs:Property'],
      }
    )
  })
})


describe('Resource', () => {
  it('should generate a resource correctly', () => {
    let res = Resource(
      URI('/'),
      type('Type1'),
      type('Type2')
    )
    expect(res.toJSON())
      .toEqual({
        '@id': '/',
        '@type': ['Type1', 'Type2']
      })
  })
})


describe('Namespace', () => {
  it('should create a namespace correctly', () => {

    const ns = Namespace(
      Class('Class1'),
      Property('prop1')
    )

    expect(
      ns.Class1(URI('/')).toJSON()
    ).toEqual(
      {
        '@id': '/',
        '@type': ['Class1']
      }
    )

    expect(
      ns.prop1('test').toJSON()
    ).toEqual(
      {
        'prop1': 'test'
      }
    )
  })
})

describe('Prefix', () => {
  it('should generate the context correctly', () => {
    const ns = Namespace(
      Class('Class1'),
      Property('prop1')
    )
    
    const prefix = Prefix(
      'vocab', 'http://example.com/vocab#', ns
    )

    expect(
      prefix.toJSON()
    ).toEqual({
      '@context': {
        'rdfs': 'http://www.w3.org/2000/01/rdf-schema#',
        'vocab': 'http://example.com/vocab#',
        'Class1': 'vocab:Class1',
        'prop1': 'vocab:prop1'
      }
    })
  })

  it('should support context overrides', () => {
    const ns = Namespace(
      Property('member'),
      Property('up')
    )

    const prefix = Prefix(
      'vocab', 'http://example.com/vocab#', ns,
      {
        'member': {'@container': '@list'},
        'up': {'@type': '@id'}
      }
    )
    expect(
      prefix.toJSON()
    ).toEqual(
      {
        '@context': {
          'rdfs': 'http://www.w3.org/2000/01/rdf-schema#',
          'vocab': 'http://example.com/vocab#',
          'member': {'@id': 'vocab:member', '@container': '@list'},
          'up': {'@id': 'vocab:up', '@type': '@id'}
        }
      }
    )
  })
})
