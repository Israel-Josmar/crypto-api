import { getPrice } from './sdk'
import nock from 'nock'

describe('get price from exchange', () => {
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

    const payload = {
      currency_from: 'ltc',
      currency_to: 'usd',
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
        result: '{{ currency_from }}_{{ currency_to }}.last_trade',
      },
    }

    const payload = {
      currency_from: 'ltc',
      currency_to: 'usd',
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
      currency_from: 'ltc',
      currency_to: 'usd',
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
        result: '{{upper currency_from }}_{{upper currency_to }}.last_trade',
      },
    }

    const payload = {
      currency_from: 'ltc',
      currency_to: 'usd',
    }

    nock('https://FakeExchange.com')
      .get('/ticker/')
      .reply(200, { LTC_USD: { last_trade: 185.00 } })

    const price = await getPrice(exchange, payload)

    expect(price).toBe(185.00)
  })
})
