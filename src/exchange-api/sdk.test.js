
describe.skip('get price from exchange', () => {
  test('currency details on url path', async () => {
    const exchange = {
      name: 'FakeExchange',
      connect: {
        url: 'https://FakeExchange.com/ticker/{options.currency_from}{options.currency_to}/',
        result: 'response.last',
      },
    }
    const price = await getPrice(exchange, options)
    expect(price).toBe(185.00)
  })
  test('request without currency details', async () => {
    const exchange = {
      name: 'FakeExchange',
      connect: {
        url: 'https://FakeExchange.com/ticker/',
        result: 'response[{options.currency_from}_{options.currency_to}].last_trade',
      },
    }
    const options = {
      currency_from: 'LTC',
      currency_to: 'USD',
    }
    const price = await getPrice(exchange, options)
    expect(price).toBe(185.00)
  })
})
