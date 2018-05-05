import { fetchByConfig } from './fetch-util'
import nock from 'nock'

describe('get price from config', () => {
  test('currency details on url path', async () => {
    const config = {
      fetch: {
        url: 'https://some.domain.com/path/ltc_usd/',
      },
      result: 'last',
    }

    nock('https://some.domain.com')
      .get('/path/ltc_usd/')
      .reply(200, { last: 185.00 })

    const price = await fetchByConfig(config)

    expect(price).toBe(185.00)
  })

  test('currency details mixed on response', async () => {
    const config = {
      fetch: {
        url: 'https://some.domain.com/path/',
      },
      result: 'ltc_usd.last_trade',
    }

    nock('https://some.domain.com')
      .get('/path/')
      .reply(200, { ltc_usd: { last_trade: 185.00 } })

    const price = await fetchByConfig(config)

    expect(price).toBe(185.00)
  })

  test('return body if there is no `result` recipe', async () => {
    const config = {
      fetch: {
        url: 'https://some.domain.com/path/',
      },
    }

    nock('https://some.domain.com')
      .get('/path/')
      .reply(200, 185.00)

    const price = await fetchByConfig(config)

    expect(price).toBe(185.00)
  })

  test('uppercase on details response', async () => {
    const config = {
      fetch: {
        url: 'https://some.domain.com/path/',
      },
      result: 'LTC_USD.last_trade',
    }

    nock('https://some.domain.com')
      .get('/path/')
      .reply(200, { LTC_USD: { last_trade: 185.00 } })

    const price = await fetchByConfig(config)

    expect(price).toBe(185.00)
  })
})
