// import { getDashboard } from './dashboard'

describe('#getDashboard', () => {
  let getDashboard

  const bestProfits = [
    {
      source: 'otherFake',
      dest: 'fake',
      coin: 'btc',
      profitPercent: 1.0049273526244242,
    },
    {
      source: 'otherFake',
      dest: 'fake',
      coin: 'eth',
      profitPercent: 1.0173607946778456,
    },
  ]

  describe('when there is profit loaded for giving amount', () => {
    beforeAll(() => {
      jest.doMock('../exchange/data-access/profit-dao', () => {
        return {
          getBest: jest.fn().mockResolvedValue(bestProfits),
        }
      })

      getDashboard = require('./dashboard').getDashboard
    })

    afterAll(() => {
      jest.resetModules()
    })

    test('should return a dashboard for giving amount, sorted by max profit', async () => {
      const dashboard = await getDashboard({ amount: 375 })

      const expected = [
        {
          source: 'otherFake',
          dest: 'fake',
          coin: 'eth',
          profitPercent: 1.0173607946778456,
        },
        {
          source: 'otherFake',
          dest: 'fake',
          coin: 'btc',
          profitPercent: 1.0049273526244242,
        },
      ]

      expect(dashboard).toEqual(expected)
    })
  })

  describe('when there is no profit loaded but there is book loaded', () => {
    let profitDaoMock = {
      getBest: jest.fn()
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(bestProfits),
    }

    beforeAll(() => {
      jest.doMock('../exchange/data-access/profit-dao', () => profitDaoMock)
      jest.doMock('../exchange/services/populate-profit-cache', () => ({
        populateCache: jest.fn().mockResolvedValue(),
      }))

      getDashboard = require('./dashboard').getDashboard
    })

    afterAll(() => {
      jest.resetModules()
    })

    test('should call profitDao.getBest', async () => {
      await getDashboard({ amount: 375 })

      expect(profitDaoMock.getBest.mock.calls.length).toEqual(2)
    })
  })
})
