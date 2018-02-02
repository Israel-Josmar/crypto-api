import { getDashboard } from './dashboard'
import {
  getPrice,
  loadFakeReturns,
  resetFakeReturns,
} from '../exchange-sdk/fake-sdk'

describe('#getDashboard', () => {
  const sdk = { getPrice }

  const data = {
    chosenExchangeId: 'fake',
    currencies: {
      usd: {
        id: 'usd',
      },
    },
    exchanges: [
      {
        id: 'fake',
        criptos: ['btc', 'eth'],
      },
      {
        id: 'otherFake',
        name: 'OtherFakeExchange',
        criptos: ['btc', 'eth'],
      },
    ],
  }

  afterAll(() => {
    resetFakeReturns()
  })

  test('should return a dashboard, sorted by max profit', async () => {
    loadFakeReturns({
      usd: 3.18,
      fake: { btc: 32136, eth: 3550 },
      otherFake: { btc: 10056.11, eth: 1097.3 },
    })

    const dashboard = await getDashboard(sdk, data)

    const expected = [
      {
        exchangeId: 'otherFake',
        exchange: 'OtherFakeExchange',
        coin: 'eth',
        profitPercent: 1.01736280074534,
      },
      {
        exchangeId: 'otherFake',
        exchange: 'OtherFakeExchange',
        coin: 'btc',
        profitPercent: 1.0049273901497189,
      },
    ]

    expect(dashboard).toEqual(expected)
  })
})
