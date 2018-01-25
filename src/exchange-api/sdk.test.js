
describe.skip('get price from exchange', () => {
  test('currency details on url path', async () => {
    const exchange = {
      name: 'FakeExchange',
      api: {
        fetch: {
          url: 'https://FakeExchange.com/ticker/{{ currency_from }}_{{ currency_to }}/',
        },
        result: 'last',
      },
    }

    const options = {
      currency_from: 'ltc',
      currency_to: 'usd',
    }

    const price = await getPrice(exchange, options)

    expect(price).toBe(185.00)
  })

  test('currency details mixed on response', async () => {
    const exchange = {
      name: 'FakeExchange',
      api: {
        fetch: {
          url: 'https://FakeExchange.com/ticker/',
        },
        result: '{{ currency_from }}_{{ currency_to }}.last_trade',
      },
    }

    const options = {
      currency_from: 'ltc',
      currency_to: 'usd',
    }
    const price = await getPrice(exchange, options)

    expect(price).toBe(185.00)
  })
})
