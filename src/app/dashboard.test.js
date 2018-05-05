import { getDashboard } from './dashboard'

import * as pricesCache from '../exchange/data-access/prices-dao'

describe('#getDashboard', () => {
  beforeAll(() => {
    pricesCache.loadAll([])
  })

  test('should return a dashboard, sorted by max profit', async () => {
    pricesCache.loadAll([
      {
        exchangeId: 'fake',
        exchange: 'FakeExchange',
        coin: 'btc',
        value: 10105.66,
      },
      {
        exchangeId: 'fake',
        exchange: 'FakeExchange',
        coin: 'eth',
        value: 1116.35,
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

    const dashboard = await getDashboard('fake')

    const expected = [
      {
        exchangeId: 'otherFake',
        exchange: 'OtherFakeExchange',
        coin: 'eth',
        profitPercent: 1.0173607946778456,
      },
      {
        exchangeId: 'otherFake',
        exchange: 'OtherFakeExchange',
        coin: 'btc',
        profitPercent: 1.0049273526244242,
      },
    ]

    expect(dashboard).toEqual(expected)
  })
})
