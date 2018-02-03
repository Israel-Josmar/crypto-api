import { getPrice } from './sdk'
import nock from 'nock'

describe('get price from exchange', () => {
  test('currency details on url path', async () => {
    const exchange = {
      name: 'FakeExchange',
      api: {
        fetch: {
          url: 'https://FakeExchange.com/ticker/{{ cripto }}_{{ currency }}/',
        },
        result: 'last',
      },
    }

    const payload = {
      cripto: 'ltc',
      currency: 'usd',
    }

    nock('https://FakeExchange.com')
      .get('/ticker/ltc_usd/')
      .reply(200, { last: 185.00 })

    const price = await getPrice(exchange, payload)

    expect(price).toBe(185.00)
  })

  test('currency details mixed on response', async () => {
    const exchange = {
      name: 'FakeExchange',
      api: {
        fetch: {
          url: 'https://FakeExchange.com/ticker/',
        },
        result: '{{ cripto }}_{{ currency }}.last_trade',
      },
    }

    const payload = {
      cripto: 'ltc',
      currency: 'usd',
    }

    nock('https://FakeExchange.com')
      .get('/ticker/')
      .reply(200, { ltc_usd: { last_trade: 185.00 } })

    const price = await getPrice(exchange, payload)

    expect(price).toBe(185.00)
  })

  test('return body if there is no `result` recipe', async () => {
    const exchange = {
      name: 'FakeExchange',
      api: {
        fetch: {
          url: 'https://FakeExchange.com/ticker/',
        },
      },
    }

    const payload = {
      cripto: 'ltc',
      currency: 'usd',
    }

    nock('https://FakeExchange.com')
      .get('/ticker/')
      .reply(200, 185.00)

    const price = await getPrice(exchange, payload)

    expect(price).toBe(185.00)
  })

  test('uppercase on details response', async () => {
    const exchange = {
      name: 'FakeExchange',
      api: {
        fetch: {
          url: 'https://FakeExchange.com/ticker/',
        },
        result: '{{#upper}}{{ cripto }}_{{ currency }}{{/upper}}.last_trade',
      },
    }

    const payload = {
      cripto: 'ltc',
      currency: 'usd',
    }

    nock('https://FakeExchange.com')
      .get('/ticker/')
      .reply(200, { LTC_USD: { last_trade: 185.00 } })

    const price = await getPrice(exchange, payload)

    expect(price).toBe(185.00)
  })
})
