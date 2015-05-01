var Immutable = require('immutable')
var im = Immutable.fromJS
var Set = Immutable.Set
var Map = Immutable.Map
var List = Immutable.List

var Graph = () => {
  var graph = {
    context: Map(),
    vocab: Map({
      "supportedClass": List(),
      "@graph": List()
    }), 
    ns: {},

    /////////////////////////////////////////////////////////////////////////// 
    // Graph Mutators
    /////////////////////////////////////////////////////////////////////////// 

    /*
     * Adds a prefix to the context
     */
    prefix: function(additionPrefix) {
      graph.context = graph.context.mergeDeep(
        im(additionPrefix)
      )      
    },

    /*
     * Declares a new class to be used by developer
     */
    declareClass: function(label, uri, ...resources) {
      
      graph.prefix(
        Map().set(label, uri)
      )



      graph.ns[label] = function(...resources) {
        return graph.resource(
          graph.type(label),
          ...resources
        )
      }

      graph.vocab = graph.vocab.updateIn(
        ['supportedClass'],
        supportedClass => supportedClass.push(
          graph.resource(
            graph.id(label),
            ...resources
          )
        )
      )
    },

    /*
     * Declares a new property to be used by developer
     */

    declareProperty: function(label, uri, ...resources) {
      graph.prefix(
        Map().set(label, uri)
      )

      graph.ns[label] = function(value) {
        return graph.literal(label, value)
      }

      graph.vocab = graph.vocab.updateIn(
        ['@graph'],
        props => props.push(
          graph.resource(
            graph.id(label),
            ...resources
          )
        )
      )      
    },

    /////////////////////////////////////////////////////////////////////////// 
    // Resource Properties
    /////////////////////////////////////////////////////////////////////////// 
    id: (uri) => Map({
      '@id': uri
    }),
    
    type: (name) => Map({
      '@type': Set([name])
    }),

    resource: (...resources) => resources.reduce(
      (x, y) => im(x).mergeDeep(im(y))
    ),

    literal: (name, value) => Map().set(name, value)
  }

  return graph
}

module.exports = Graph;
