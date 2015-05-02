const Immutable = require('immutable')
const im = Immutable.fromJS
const Map = Immutable.Map
const Set = Immutable.Set
const List = Immutable.List

///////////////////////////////////////////////////////////////////////////////
// The Namespace constructor
///////////////////////////////////////////////////////////////////////////////
export const Namespace = (...resources) => resources.reduce(
  (accum, x) => {
    let typeURI = x.get('@id')
    let resourceType = x.get('@type', Set())
    if(resourceType.contains('rdfs:Class')) {
      accum[typeURI] = resourceFactory(typeURI)
    } else if (resourceType.contains('rdfs:Property')) {
      accum[typeURI] = propertyFactory(typeURI)
    }
    accum['@graph'] = accum['@graph'].push(x)
    return accum
  },
  {
    '@graph': List()
  }
)

export const Prefix = (prefix, uri, namespace) => 
  namespace['@graph'].reduce(
    (accum, x) => {
      let label = x.get('@id')
      return accum.updateIn(
        ['@context'],
        context => context.set(
          label, prefix + ':' + label
        )
      )
    },
    Map({
      '@context': Map().set(prefix, uri)
    })
  )


///////////////////////////////////////////////////////////////////////////////
// The Resource constructor
///////////////////////////////////////////////////////////////////////////////
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
  Resource(URI(label), type('rdfs:Property'), ...properties)



///////////////////////////////////////////////////////////////////////////////
// Internal
///////////////////////////////////////////////////////////////////////////////

// A function that creates a namespace's resource constructor
const resourceFactory = typeURI => function(...properties) {
  return Resource(type(typeURI), ...properties)
}

const propertyFactory = propURI => function(value) {
  return Map().set(propURI, value)
}
