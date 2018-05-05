import * as pricesCache from '../data-access/prices-dao'

describe('#populateCache', () => {
  let populateCache, exchangeDao, exchangeSDK

  beforeAll(() => {
    jest.mock('../data-access/exchange-dao')
    jest.mock('../vendor-api/exchanges-sdk')

    exchangeDao = require('../data-access/exchange-dao')
    exchangeSDK = require('../vendor-api/exchanges-sdk')

    populateCache = require('./cripto-prices').populateCache
  })

  afterAll(() => {
    jest.resetModules()
  })

  test('should populate cache with fetched data from sdk', async () => {
    exchangeDao.getAllExchanges.mockResolvedValueOnce([
      {
        id: 'fake',
        name: 'FakeExchange',
        coins: ['btc', 'eth'],
        currency: 'brl',
      },
      {
        id: 'otherFake',
        name: 'OtherFakeExchange',
        coins: ['btc', 'eth'],
      },
    ])

    exchangeDao.getAllCurrencies.mockResolvedValueOnce([{ id: 'brl' }])

    // currency
    exchangeSDK.getPrice.mockResolvedValueOnce(0.31)

    // criptos
    const tickles = {
      fake: { btc: 32337.95, eth: 3572.32 },
      otherFake: { btc: 10056.11, eth: 1097.3 },
    }
    exchangeSDK.getPrice.mockImplementation(async (exchange, { coin }) => tickles[exchange.id][coin])

    await populateCache()

    const cache = await pricesCache.getAll()

    expect(cache).toEqual([
      {
        exchangeId: 'fake',
        exchange: 'FakeExchange',
        coin: 'btc',
        value: 10024.7645,
      },
      {
        exchangeId: 'fake',
        exchange: 'FakeExchange',
        coin: 'eth',
        value: 1107.4192,
      },
      {
        exchangeId: 'otherFake',
        exchange: 'OtherFakeExchange',
        coin: 'btc',
        value: 10056.11,
      },
      {
        exchangeId: 'otherFake',
        exchange: 'OtherFakeExchange',
        coin: 'eth',
        value: 1097.3,
      },
    ])
  })
})
