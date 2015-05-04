'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var _bind = Function.prototype.bind;
var _slice = Array.prototype.slice;

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _im$Map$Set$List = require('immutable');

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
var Namespace = function Namespace() {
  for (var _len = arguments.length, definitions = Array(_len), _key = 0; _key < _len; _key++) {
    definitions[_key] = arguments[_key];
  }

  return definitions.reduce(function (accum, x) {
    var typeURI = x.get('@id');
    var resourceType = x.get('@type', _im$Map$Set$List.Set());
    var factoryFun = resourceType.contains('rdfs:Class') ? resourceFactory(typeURI) : resourceType.contains('rdfs:Property') ? propertyFactory(typeURI) : undefined;
    accum[typeURI] = factoryFun;
    accum['@graph'] = accum['@graph'].push(x);
    return accum;
  }, new NamespaceClass());
};

exports.Namespace = Namespace;

var NamespaceClass = function NamespaceClass() {
  _classCallCheck(this, NamespaceClass);

  this['@graph'] = _im$Map$Set$List.List();
};

exports.NamespaceClass = NamespaceClass;

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
var Prefix = function Prefix(prefix, uri, namespace) {
  var context = arguments[3] === undefined ? {} : arguments[3];

  var contextMap = _im$Map$Set$List.fromJS(context);
  return new ResourceClass(namespace['@graph'].reduce(function (accum, x) {
    var label = x.get('@id');
    var uri = prefix + ':' + label;
    var value = contextMap.has(label) ? contextMap.get(label).set('@id', uri) : uri;
    return accum.updateIn(['@context'], function (context) {
      return context.set(label, value);
    });
  }, _im$Map$Set$List.Map({
    '@context': _im$Map$Set$List.Map({
      rdfs: 'http://www.w3.org/2000/01/rdf-schema#'
    }).set(prefix, uri)
  })));
};

exports.Prefix = Prefix;
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
var Resource = function Resource() {
  for (var _len2 = arguments.length, properties = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    properties[_key2] = arguments[_key2];
  }

  return new ResourceClass(properties.reduce(function (x, y) {
    return _im$Map$Set$List.fromJS(x).mergeDeep(_im$Map$Set$List.fromJS(y));
  }));
};

exports.Resource = Resource;

var ResourceClass = (function (_Map) {
  function ResourceClass() {
    _classCallCheck(this, ResourceClass);

    if (_Map != null) {
      var _this = new (_bind.apply(_Map, [null].concat(_slice.call(arguments))))();

      _this.__proto__ = ResourceClass.prototype;
      return _this;
    }

    return _this;
  }

  _inherits(ResourceClass, _Map);

  return ResourceClass;
})(_im$Map$Set$List.Map);

exports.ResourceClass = ResourceClass;

///////////////////////////////////////////////////////////////////////////////
// A convenience function for the '@id' field
///////////////////////////////////////////////////////////////////////////////
var URI = function URI(uri) {
  return new ResourceClass({
    '@id': uri
  });
};

exports.URI = URI;
///////////////////////////////////////////////////////////////////////////////
// A convenience function for the '@type' field
///////////////////////////////////////////////////////////////////////////////
var type = function type(uri) {
  return new ResourceClass({
    '@type': _im$Map$Set$List.Set([uri])
  });
};

exports.type = type;
///////////////////////////////////////////////////////////////////////////////
// A convenience function for defining classes
///////////////////////////////////////////////////////////////////////////////
var Class = function Class(label) {
  for (var _len3 = arguments.length, properties = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    properties[_key3 - 1] = arguments[_key3];
  }

  return Resource.apply(undefined, [URI(label), type('rdfs:Class')].concat(properties));
};

exports.Class = Class;
///////////////////////////////////////////////////////////////////////////////
// A convenience function for defining Properties
///////////////////////////////////////////////////////////////////////////////
var Property = function Property(label) {
  for (var _len4 = arguments.length, properties = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    properties[_key4 - 1] = arguments[_key4];
  }

  return Resource.apply(undefined, [URI(label), type('rdfs:Property')].concat(properties));
};

exports.Property = Property;
var Vocab = function Vocab() {
  for (var _len5 = arguments.length, namespaces = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    namespaces[_key5] = arguments[_key5];
  }

  return new ResourceClass(namespaces.reduce(function (accum, y) {
    return accum.updateIn(['@graph'], function (graph) {
      return graph.concat(y['@graph']);
    });
  }, _im$Map$Set$List.Map({ '@graph': _im$Map$Set$List.List() })));
};
exports.Vocab = Vocab;
///////////////////////////////////////////////////////////////////////////////
// Internal
///////////////////////////////////////////////////////////////////////////////

// A function that creates a namespace's resource constructor
var resourceFactory = function resourceFactory(typeURI) {
  return function () {
    for (var _len6 = arguments.length, properties = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      properties[_key6] = arguments[_key6];
    }

    return Resource.apply(undefined, [type(typeURI)].concat(properties));
  };
};

var propertyFactory = function propertyFactory(propURI) {
  return function (value) {
    return new ResourceClass().set(propURI, _im$Map$Set$List.fromJS(value));
  };
};