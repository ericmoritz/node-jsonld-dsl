/* -*- mode: javascript -*- */
import {Namespace, Class, Property, Prefix} from './jsonld-dsl'
import {Set} from 'immutable'

const ns = Namespace(
  Property("apiDocumentation"),
  Property("description"),
  Property("entrypoint"),
  Property("expects"),
  Property("firstPage"),
  Property("freetextQuery"),
  Property("itemsPerPage"),
  Property("lastPage"),
  Property("mapping"),
  Property("member"),
  Property("method"),
  Property("nextPage"),
  Property("operation"),
  Property("possibleStatus"),
  Property("previousPage"),
  Property("property"),
  Property("readable"),
  Property("required"),
  Property("returns"),
  Property("search"),
  Property("statusCode"),
  Property("supportedProperty"),
  Property("supportedOperation"),
  Property("supportedProperty"),
  Property("template"),
  Property("title"),
  Property("totalItems"),
  Property("variable"),
  Property("variableRepresentation"),
  Property("writeable"),
  Class("ApiDocumentation"),
  Class("Class"),
  Class("Collection"),
  Class("CreateResourceOperation"),
  Class("DeleteResourceOperation"),
  Class("Error"),
  Class("IriTemplate"),
  Class("IriTemplateMapping"),
  Class("Link"),
  Class("Operation"),
  Class("PagedCollection"),
  Class("ReplaceResourceOperation"),
  Class("Resource"),
  Class("Status"),
  Class("SupportedProperty"),
  Class("TemplatedLink"),
  Class("VariableRepresentation")
)

const operationFactory = (method) => (...properties) => ns.operation(
  Set.of(
    ns.Operation(
      ns.method(method),
      ...properties
    )
  )
)

ns.PUT = operationFactory('PUT')
ns.POST = operationFactory('POST')
ns.DELETE = operationFactory('DELETE')
ns.context = Prefix(
  'hydra', 'http://www.w3.org/ns/hydra/core#', ns
)
export default ns
