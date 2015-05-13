import DSLModule from 'jsonld-dsl'
import IndexModule from '../src/index'
import expect from 'expect'

it('should support importing as jsonld-dsl', () => {
  expect(
    DSLModule
  ).toEqual(
    IndexModule
  )
})
