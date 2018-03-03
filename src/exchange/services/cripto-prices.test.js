import { getAll, loadAll } from '../data-access/prices-dao'

import {
  getAllExchanges,
  getAllCurrencies,
  loadFake as exchangeDAOLoadFake,
} from '../data-access/exchange-dao-fake'

import {
  getPrice,
  loadFake as exchangeSDKLoadFake,
} from '../vendor-api/exchanges-sdk-fake'

import {
  populateCache,
} from './cripto-prices'

describe('#populateCache', () => {
  beforeAll(() => {
    exchangeDAOLoadFake({})
    exchangeSDKLoadFake({})
  })

  test('should populate cache with fetched data from sdk', async () => {
    exchangeDAOLoadFake({
      currencies: [
        {
          id: 'brl',
        },
      ],
      exchanges: [
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
      ],
    })

    exchangeSDKLoadFake({
      brl: 0.31,
      fake: { btc: 32337.95, eth: 3572.32 },
      otherFake: { btc: 10056.11, eth: 1097.3 },
    })

    const pricesCache = { loadAll }
    const exchangeDAO = { getAllExchanges, getAllCurrencies }
    const exchangeSDK = { getPrice }

    await populateCache({ pricesCache, exchangeDAO, exchangeSDK })

    const cache = await getAll()

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
