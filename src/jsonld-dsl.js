const Immutable = require('immutable')
const im = Immutable.fromJS
const Map = Immutable.Map
const Set = Immutable.Set
const List = Immutable.List

///////////////////////////////////////////////////////////////////////////////
// The Namespace constructor
///////////////////////////////////////////////////////////////////////////////
/*
 * Generates a Namespace based on the Class() and Property()
 * definitions passed in.
 * 
 * Usage:
 *
 * const ns = Namespace(
 *    Class('Class1'),
 *    Property('prop1')
 * )
 * ns.Class1(
 *   ns.prop1("prop1's value")
 * ) // Returns a Immutable.Map() of the Class1 resource instance
 *
 */
export const Namespace =
  (...definitions) => definitions.reduce(
    (accum, x) => {
      let typeURI = x.get('@id')
      let resourceType = x.get('@type', Set())
      let factoryFun = (
        resourceType.contains('rdfs:Class')
          ? resourceFactory(typeURI)
          : resourceType.contains('rdfs:Property')
          ? propertyFactory(typeURI)
          : undefined
      )
      accum[typeURI] = factoryFun
      accum['@graph'] = accum['@graph'].push(x)
      return accum
    },
    {
      '@graph': List()
    }
  )

///////////////////////////////////////////////////////////////////////////////
// The Prefix constructor
///////////////////////////////////////////////////////////////////////////////
/*
 * includes the @context for a Namespace into the resource
 *
 * Usage:
 * 
 * const ns = Namespace(
 *   Class('Class1'),
 *   Property('prop1')
 * )
 * 
 * ns.Class1(
 *  Prefix('vocab', 'http://example.com/vocab#', ns),
 *  ns.prop1('value1')
 * ) // returns a Class1 instance with the @context of ns
 */
export const Prefix = (prefix, uri, namespace, context={}) => {
  let contextMap = im(context)
  return namespace['@graph'].reduce(
    (accum, x) => {
      let label = x.get('@id')
      let uri = prefix + ':' + label
      let value = (
        contextMap.has(label)
          ? contextMap.get(label).set('@id', uri)
          : uri
      )
      return accum.updateIn(
        ['@context'],
        context => context.set(
          label, value
        )
      )
    },
    Map({
      '@context': Map(
        {
          'rdfs': 'http://www.w3.org/2000/01/rdf-schema#'
        }
      ).set(
        prefix, uri
      )
    })
  )
}


///////////////////////////////////////////////////////////////////////////////
// The Resource constructor
///////////////////////////////////////////////////////////////////////////////
/*
 * Composes a JSON-LD Resource as a Immutable.Map()
 * 
 * Usage
 *
 *
 * const schema = Namespace(
 *   Class('Thing'),
 *   Property('image'), 
 *   Class('Person'),
 *   Property('familyName'),
 *   Property('givenName'),
 * )
 * 
 * const resource = Resource(
 *    URI('#ericmoritz'),
 *    Prefix('schema', 'http://schema.org/', schema),
 *    schema.Thing(
 *      schema.image("http://www.gravatar.com/avatar/4839d0678248e68eaeed5084e788210b.png")
 *    ),
 *    schema.Person(
 *      schema.givenName('Eric'),
 *      schema.familyName('Moritz')
 *    )
 * ) // Creates a Immutable.Map() of the union of a Thing and Person resource
 *      
 */ 
export const Resource = (...properties) =>
  properties.reduce(
    (x, y) => im(x).mergeDeep(im(y))
  )


///////////////////////////////////////////////////////////////////////////////
// A convenience function for the '@id' field
///////////////////////////////////////////////////////////////////////////////
export const URI = (uri) =>
  Map({
    '@id': uri
  })


///////////////////////////////////////////////////////////////////////////////
// A convenience function for the '@type' field
///////////////////////////////////////////////////////////////////////////////
export const type = (uri) =>
  Map({
    '@type': Set([uri])
  })


///////////////////////////////////////////////////////////////////////////////
// A convenience function for defining classes
///////////////////////////////////////////////////////////////////////////////
export const Class = (label, ...properties) =>
  Resource(
    URI(label),
    type('rdfs:Class'),
      ...properties
  )


///////////////////////////////////////////////////////////////////////////////
// A convenience function for defining Properties
///////////////////////////////////////////////////////////////////////////////
export const Property = (label, ...properties) =>
  Resource(
    URI(label),
    type('rdfs:Property'),
    ...properties
  )

export const Vocab = (...namespaces) =>
  namespaces.reduce(
    (accum, y) => accum.updateIn(
      ['@graph'],
      graph => graph.concat(
        y['@graph']
      )
    ),
    Map({'@graph': List()})
  )
///////////////////////////////////////////////////////////////////////////////
// Internal
///////////////////////////////////////////////////////////////////////////////

// A function that creates a namespace's resource constructor
const resourceFactory = typeURI => (...properties) =>
  Resource(type(typeURI), ...properties)


const propertyFactory = propURI => value => 
  Map().set(propURI, im(value))
