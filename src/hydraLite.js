const Graph = require('./graph')
const hydra = Graph()

hydra.prefix({
  'hydra': 'http://www.w3.org/ns/hydra/core#'
})

hydra.declareProperty('title', 'hydra:title')
hydra.declareProperty('description', 'hydra:description')

hydra.declareClass('Resource', 'hydra:Resource')
hydra.declareProperty('operation', 'hydra:operation')
hydra.declareProperty('supportedProperty', 'hydra:supportedProperty')


hydra.declareClass('Operation', 'hydra:Operation')
hydra.declareProperty('method', 'hydra:method')
hydra.declareProperty('expects', 'hydra:expects')
hydra.declareProperty('returns', 'hydra:returns')
hydra.declareProperty('statusCodes', 'hydra:statusCodes')

hydra.declareClass('CreateResourceOperation', 'hydra:CreateResourceOperation')
hydra.declareClass('DeleteResourceOperation', 'hydra:DeleteResourceOperation')
hydra.declareClass('ReplaceResourceOperation', 'hydra:ReplaceResourceOperation')

hydra.declareClass('SupportedProperty', 'hydra:SupportedProperty')
hydra.declareProperty('property', 'hydra:property')
hydra.declareProperty('required', 'hydra:required')
hydra.declareProperty('readonly', 'hydra:readonly')
hydra.declareProperty('writeonly', 'hydra:writeonly')

module.exports = hydra
