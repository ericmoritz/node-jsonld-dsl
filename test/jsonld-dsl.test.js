const NS = require('../src/namespace2')
const Namespace = NS.Namespace
const URI = NS.URI
const Class = NS.Class
const Property = NS.Property
const type = NS.type
const Resource = NS.Resource
const Vocab = NS.Vocab
const Context = NS.Context
const Prefix = NS.Prefix
const expect = require('expect')
const Immutable = require('immutable')
const Map = Immutable.Map
const Set = Immutable.Set
const List = Immutable.List

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
        'vocab': 'http://example.com/vocab#',
        'Class1': 'vocab:Class1',
        'prop1': 'vocab:prop1'
      }
    })
  })
})
