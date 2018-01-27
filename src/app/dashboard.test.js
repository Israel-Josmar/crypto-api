import { getDashboard } from './dashboard'
import { getPrice } from '../exchange-sdk/fake-sdk'

describe.skip('#getDashboard', () => {
  test('should return a dashboard', async () => {
    const dashboard = await getDashboard({ getPrice })

    const expected = [
      {
        exchange: 'FakeExchange',
        coin: 'Litecoin',
        profit: '400.00',
        profitPercent: '3%',
      },
    ]

    expect(dashboard).toEqual(expected)
  })
})
