describe('#populateCache', () => {
  let populateCache, exchangeDao, bookCache, exchangeSDK, currencySDK

  beforeAll(() => {
    jest.mock('../data-access/exchange-dao')
    jest.mock('../data-access/book-dao')
    jest.mock('../vendor-api/exchanges-sdk')
    jest.mock('../vendor-api/currency-sdk')

    exchangeDao = require('../data-access/exchange-dao')
    bookCache = require('../data-access/book-dao')
    exchangeSDK = require('../vendor-api/exchanges-sdk')
    currencySDK = require('../vendor-api/currency-sdk')

    populateCache = require('./populate-book-cache').populateCache
  })

  afterAll(() => {
    jest.resetModules()
  })

  test('should populate cache with fetched data from sdk', async () => {
    exchangeDao.getAllExchanges.mockResolvedValueOnce([
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
    ])

    exchangeDao.getAllCurrencies.mockResolvedValueOnce([{ id: 'brl' }])

    // currency
    currencySDK.getPrice.mockResolvedValueOnce(0.31)

    // criptos
    const books = {
      fake: {
        btc: {
          asks: [
            { price: 34849.902, amount: 0.0012599 },
            { price: 34849.912, amount: 0.09950249 },
          ],
          bids: [
            { price: 34300, amount: 0.2 },
            { price: 34099, amount: 0.05701809 },
          ],
        },
        eth: {
          asks: [
            { price: 2625, amount: 0.4581538 },
            { price: 2638.96, amount: 0.98258844 },
          ],
          bids: [
            { price: 2570, amount: 0.1299496 },
            { price: 2520, amount: 0.39477809 },
          ],
        },
      },
      otherFake: {
        btc: {
          bids: [
            { price: 9928.29, amount: 0.06800000 },
            { price: 9925.81, amount: 0.07500000 },
          ],
          asks: [
            { price: 9932.13, amount: 1.72125900 },
            { price: 9933.71, amount: 1.50880000 },
          ],
        },
        eth: {
          bids: [
            { price: 757.17, amount: 3.84000000 },
            { price: 757.16, amount: 24.75000000 },
          ],
          asks: [
            { price: 758.78, amount: 3.85549774 },
            { price: 760.12, amount: 72.10600000 },
          ],
        },
      },
    }
    exchangeSDK.getBook.mockImplementation(async (exchange, { coin }) => books[exchange.id][coin])

    await populateCache()

    expect(bookCache.loadAll.mock.calls.length).toEqual(1)

    expect(bookCache.loadAll.mock.calls[0][0]).toEqual([
      {
        exchangeId: 'fake',
        exchangeName: 'FakeExchange',
        coin: 'btc',
        asks: [
          { price: 10803.46962, amount: 0.0012599 },
          { price: 10803.47272, amount: 0.09950249 },
        ],
        bids: [
          { price: 10633, amount: 0.2 },
          { price: 10570.69, amount: 0.05701809 },
        ],
      },
      {
        exchangeId: 'fake',
        exchangeName: 'FakeExchange',
        coin: 'eth',
        asks: [
          { price: 813.75, amount: 0.4581538 },
          { price: 818.0776, amount: 0.98258844 },
        ],
        bids: [
          { price: 796.7, amount: 0.1299496 },
          { price: 781.2, amount: 0.39477809 },
        ],
      },
      {
        exchangeId: 'otherFake',
        exchangeName: 'OtherFakeExchange',
        coin: 'btc',
        bids: [
          { price: 9928.29, amount: 0.06800000 },
          { price: 9925.81, amount: 0.07500000 },
        ],
        asks: [
          { price: 9932.13, amount: 1.72125900 },
          { price: 9933.71, amount: 1.50880000 },
        ],
      },
      {
        exchangeId: 'otherFake',
        exchangeName: 'OtherFakeExchange',
        coin: 'eth',
        bids: [
          { price: 757.17, amount: 3.84000000 },
          { price: 757.16, amount: 24.75000000 },
        ],
        asks: [
          { price: 758.78, amount: 3.85549774 },
          { price: 760.12, amount: 72.10600000 },
        ],
      },
    ])
  })
})
