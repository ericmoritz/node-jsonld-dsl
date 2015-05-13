'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
/* -*- mode: javascript -*- */

var _Namespace$Class$Property$Prefix = require('./jsonld-dsl');

var _Set = require('immutable');

var ns = _Namespace$Class$Property$Prefix.Namespace(_Namespace$Class$Property$Prefix.Property('apiDocumentation'), _Namespace$Class$Property$Prefix.Property('description'), _Namespace$Class$Property$Prefix.Property('entrypoint'), _Namespace$Class$Property$Prefix.Property('expects'), _Namespace$Class$Property$Prefix.Property('firstPage'), _Namespace$Class$Property$Prefix.Property('freetextQuery'), _Namespace$Class$Property$Prefix.Property('itemsPerPage'), _Namespace$Class$Property$Prefix.Property('lastPage'), _Namespace$Class$Property$Prefix.Property('mapping'), _Namespace$Class$Property$Prefix.Property('member'), _Namespace$Class$Property$Prefix.Property('method'), _Namespace$Class$Property$Prefix.Property('nextPage'), _Namespace$Class$Property$Prefix.Property('operation'), _Namespace$Class$Property$Prefix.Property('possibleStatus'), _Namespace$Class$Property$Prefix.Property('previousPage'), _Namespace$Class$Property$Prefix.Property('property'), _Namespace$Class$Property$Prefix.Property('readable'), _Namespace$Class$Property$Prefix.Property('required'), _Namespace$Class$Property$Prefix.Property('returns'), _Namespace$Class$Property$Prefix.Property('search'), _Namespace$Class$Property$Prefix.Property('statusCode'), _Namespace$Class$Property$Prefix.Property('supportedProperty'), _Namespace$Class$Property$Prefix.Property('supportedOperation'), _Namespace$Class$Property$Prefix.Property('supportedProperty'), _Namespace$Class$Property$Prefix.Property('template'), _Namespace$Class$Property$Prefix.Property('title'), _Namespace$Class$Property$Prefix.Property('totalItems'), _Namespace$Class$Property$Prefix.Property('variable'), _Namespace$Class$Property$Prefix.Property('variableRepresentation'), _Namespace$Class$Property$Prefix.Property('writeable'), _Namespace$Class$Property$Prefix.Class('ApiDocumentation'), _Namespace$Class$Property$Prefix.Class('Class'), _Namespace$Class$Property$Prefix.Class('Collection'), _Namespace$Class$Property$Prefix.Class('CreateResourceOperation'), _Namespace$Class$Property$Prefix.Class('DeleteResourceOperation'), _Namespace$Class$Property$Prefix.Class('Error'), _Namespace$Class$Property$Prefix.Class('IriTemplate'), _Namespace$Class$Property$Prefix.Class('IriTemplateMapping'), _Namespace$Class$Property$Prefix.Class('Link'), _Namespace$Class$Property$Prefix.Class('Operation'), _Namespace$Class$Property$Prefix.Class('PagedCollection'), _Namespace$Class$Property$Prefix.Class('ReplaceResourceOperation'), _Namespace$Class$Property$Prefix.Class('Resource'), _Namespace$Class$Property$Prefix.Class('Status'), _Namespace$Class$Property$Prefix.Class('SupportedProperty'), _Namespace$Class$Property$Prefix.Class('TemplatedLink'), _Namespace$Class$Property$Prefix.Class('VariableRepresentation'));

var operationFactory = function operationFactory(method) {
  return function () {
    for (var _len = arguments.length, properties = Array(_len), _key = 0; _key < _len; _key++) {
      properties[_key] = arguments[_key];
    }

    return ns.operation(_Set.Set.of(ns.Operation.apply(ns, [ns.method(method)].concat(properties))));
  };
};

ns.PUT = operationFactory('PUT');
ns.POST = operationFactory('POST');
ns.DELETE = operationFactory('DELETE');
ns.context = _Namespace$Class$Property$Prefix.Prefix('hydra', 'http://www.w3.org/ns/hydra/core#', ns);
exports['default'] = ns;
module.exports = exports['default'];
