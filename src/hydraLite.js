const Namespace = require('./namespace')
const hydra = Namespace()

hydra._.prefix({
  'hydra': 'http://www.w3.org/ns/hydra/core#'
})

hydra._.declareProperty('title', 'hydra:title')
hydra._.declareProperty('description', 'hydra:description')

hydra._.declareClass('Resource', 'hydra:Resource')
hydra._.declareProperty('operation', 'hydra:operation')
hydra._.declareProperty('supportedProperty', 'hydra:supportedProperty')


hydra._.declareClass('Operation', 'hydra:Operation')
hydra._.declareProperty('method', 'hydra:method')
hydra._.declareProperty('expects', 'hydra:expects')
hydra._.declareProperty('returns', 'hydra:returns')
hydra._.declareProperty('statusCodes', 'hydra:statusCodes')

hydra._.declareClass('CreateResourceOperation', 'hydra:CreateResourceOperation')
hydra._.declareClass('DeleteResourceOperation', 'hydra:DeleteResourceOperation')
hydra._.declareClass('ReplaceResourceOperation', 'hydra:ReplaceResourceOperation')

hydra._.declareClass('SupportedProperty', 'hydra:SupportedProperty')
hydra._.declareProperty('property', 'hydra:property')
hydra._.declareProperty('required', 'hydra:required')
hydra._.declareProperty('readonly', 'hydra:readonly')
hydra._.declareProperty('writeonly', 'hydra:writeonly')

module.exports = hydra
