import {Resource, hydra} from '../src/index'
import expect from 'expect'

describe('hydra support', () => {
  describe('operation shortcuts', () => {
    it('should support operation composition', () => {
      expect(
        Resource(
          hydra.PUT(),
          hydra.DELETE()
        ).toJSON()
      ).toEqual(
        {
          'operation': [
            {'@type': ['Operation'], 'method': 'PUT'},
            {'@type': ['Operation'], 'method': 'DELETE'}
          ]
        }
      )
    })

    it('should support PUT', () => {
      expect(
        hydra.PUT().toJSON()
      ).toEqual(
        {
          'operation': [
            {'@type': ['Operation'], 'method': 'PUT'}
          ]
        }
      )
    })

    it('should support POST', () => {
      expect(
        hydra.POST().toJSON()
      ).toEqual(
        {
          'operation': [
            {'@type': ['Operation'], 'method': 'POST'}
          ]
        }
      )
    })

    it('should support DELETE', () => {
      expect(
        hydra.DELETE().toJSON()
      ).toEqual(
        {
          'operation': [
            {'@type': ['Operation'], 'method': 'DELETE'}
          ]
        }
      )
    })


  })
})
