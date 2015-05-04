import {fromJS as im, Map, Set, List} from 'immutable'

///////////////////////////////////////////////////////////////////////////////
// The Namespace constructor
///////////////////////////////////////////////////////////////////////////////
/*
 * Generates a Namespace based on the Class() and Property()
 * definitions passed in.
 * 
 * Usage:
 *
 * var ns = Namespace(
 *    Class('Class1'),
 *    Property('prop1')
 * )
 * ns.Class1(
 *   ns.prop1("prop1's value")
 * )
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
    new NamespaceClass()
  )

export class NamespaceClass {
  constructor() {
    this['@graph'] = List()
  }
}
///////////////////////////////////////////////////////////////////////////////
// The Prefix constructor
///////////////////////////////////////////////////////////////////////////////
/*
 * includes the @context for a Namespace into the resource
 *
 * Usage:
 * 
 * var ns = Namespace(
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
  return new ResourceClass(
    namespace['@graph'].reduce(
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
 * var schema = Namespace(
 *   Class('Thing'),
 *   Property('image'), 
 *   Class('Person'),
 *   Property('familyName'),
 *   Property('givenName'),
 * )
 * 
 * var resource = Resource(
 *    URI('#ericmoritz'),
 *    Prefix('schema', 'http://schema.org/', schema),
 *    schema.Thing(
 *      schema.image("http://www.gravatar.com/avatar/4839d0678248e68eaeed5084e788210b.png")
 *    ),
 *    schema.Person(
 *      schema.givenName('Eric'),
 *      schema.familyName('Moritz')
 *    )
 * )
 *      
 */ 
export const Resource = (...properties) =>
  new ResourceClass(
    properties.reduce(
      (x, y) => im(x).mergeDeep(im(y))
    )
  )

export class ResourceClass extends Map {}

///////////////////////////////////////////////////////////////////////////////
// A convenience function for the '@id' field
///////////////////////////////////////////////////////////////////////////////
export const URI = (uri) =>
  new ResourceClass({
    '@id': uri
  })


///////////////////////////////////////////////////////////////////////////////
// A convenience function for the '@type' field
///////////////////////////////////////////////////////////////////////////////
export const type = (uri) =>
  new ResourceClass({
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
  new ResourceClass(
    namespaces.reduce(
      (accum, y) => accum.updateIn(
        ['@graph'],
        graph => graph.concat(
          y['@graph']
        )
      ),
      Map({'@graph': List()})
    )
  )
///////////////////////////////////////////////////////////////////////////////
// Internal
///////////////////////////////////////////////////////////////////////////////

// A function that creates a namespace's resource constructor
const resourceFactory = typeURI => (...properties) =>
  Resource(type(typeURI), ...properties)


const propertyFactory = propURI => value => 
  new ResourceClass().set(propURI, im(value))
