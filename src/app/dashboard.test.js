import { getDashboard } from './dashboard'

import {
  getAll,
  loadAll,
} from '../prices-cache/cache'

describe('#getDashboard', () => {
  beforeAll(() => {
    loadAll([])
  })

  test('should return a dashboard, sorted by max profit', async () => {
    loadAll([
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

    const pricesCache = { getAll }

    const dashboard = await getDashboard(pricesCache, 'fake')

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
