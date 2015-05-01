var Immutable = require('immutable')
var im = Immutable.fromJS
var Set = Immutable.Set
var Map = Immutable.Map
var List = Immutable.List

var Namespace = () => {
  var namespace = {
    _: {
      context: Map(),
      vocab: Map({
        "supportedClass": List(),
        "@graph": List()
      }), 

      /////////////////////////////////////////////////////////////////////////// 
      // Namespace Mutators
      /////////////////////////////////////////////////////////////////////////// 

      /*
       * Adds a prefix to the context
       */
      prefix: function(additionPrefix) {
        namespace._.context = namespace._.context.mergeDeep(
          im(additionPrefix)
        )      
      },

      /*
       * Declares a new class to be used by developer
       */
      declareClass: function(label, uri, ...resources) {
      
        namespace._.prefix(
          Map().set(label, uri)
        )



        namespace[label] = function(...resources) {
          return namespace._.resource(
            namespace._.type(label),
              ...resources
          )
        }

        namespace._.vocab = namespace._.vocab.updateIn(
          ['supportedClass'],
          supportedClass => supportedClass.push(
            namespace._.resource(
              namespace._.id(label),
                ...resources
            )
          )
        )
      },

      /*
       * Declares a new property to be used by developer
       */

      declareProperty: function(label, uri, ...resources) {
        namespace._.prefix(
          Map().set(label, uri)
        )
        
        namespace[label] = function(value) {
          return namespace._.literal(label, value)
      }
        
        namespace._.vocab = namespace._.vocab.updateIn(
          ['@graph'],
          props => props.push(
            namespace._.resource(
              namespace._.id(label),
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
  }    
  return namespace
}
  
module.exports = Namespace;
