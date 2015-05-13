'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _import = require('./jsonld-dsl');

var jsonldMod = _interopRequireWildcard(_import);

var _hydraMod = require('./hydra');

var _hydraMod2 = _interopRequireWildcard(_hydraMod);

jsonldMod.hydra = _hydraMod2['default'];
exports['default'] = jsonldMod;
module.exports = exports['default'];
