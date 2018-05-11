describe('#populateCache', () => {
  let populateCache, bookCache, profitCache

  beforeAll(() => {
    jest.mock('../data-access/book-dao')
    jest.mock('../data-access/profit-dao')

    bookCache = require('../data-access/book-dao')
    profitCache = require('../data-access/profit-dao')

    populateCache = require('./populate-profit-cache').populateCache
  })

  afterAll(() => {
    jest.resetModules()
  })

  test('should properly calculate and store profit opportunities', async () => {
    await bookCache.getAll.mockResolvedValue([
      {
        exchangeId: 'fake',
        exchangeName: 'Fake Exchange',
        btc: {
          asks: [
            { price: 10803.46962, amount: 0.0012599 },
            { price: 10803.47272, amount: 0.09950249 },
          ],
          bids: [
            { price: 10633, amount: 0.2 },
            { price: 10570.69, amount: 0.05701809 },
            { price: 10420.10, amount: 0.08243535 },
          ],
        },
        eth: {
          asks: [
            { price: 813.75, amount: 0.4581538 },
            { price: 818.0776, amount: 0.98258844 },
          ],
          bids: [
            { price: 796.7, amount: 0.1299496 },
            { price: 781.2, amount: 0.39477809 },
            { price: 776.5, amount: 1.22345574 },
            { price: 770.0, amount: 0.52437547 },
            { price: 768.0, amount: 2.14656443 },
          ],
        },
      },
      {
        exchangeId: 'otherFake',
        exchangeName: 'Other Fake Exchange',
        btc: {
          asks: [
            { price: 9932.13, amount: 1.72125900 },
            { price: 9933.71, amount: 1.50880000 },
          ],
          bids: [
            { price: 9928.29, amount: 0.06800000 },
            { price: 9925.81, amount: 0.07500000 },
          ],
        },
        eth: {
          asks: [
            { price: 758.78, amount: 3.85549774 },
            { price: 760.12, amount: 72.10600000 },
          ],
          bids: [
            { price: 757.17, amount: 3.84000000 },
            { price: 757.16, amount: 24.75000000 },
          ],
        },
      },
    ])

    // brl -> usd = 0.317460317
    // 1000 -> 317.460317
    // 5000 -> 1587.301585
    // 10000 -> 3174.60317

    await Promise.all([
      populateCache({ amount: 317.460317  }),
      populateCache({ amount: 1587.301585  }),
      populateCache({ amount: 3174.60317  }),
    ])

    expect(profitCache.loadAll.mock.calls.length).toEqual(3)

    // expect(await profitCache.getBest(10000)).toEqual(null)

    expect(profitCache.loadAll.mock.calls[0][0]).toEqual([
      // [btc] otherFake (asks) -> fake (bids)
      // buy: 317.460317 = (0.031962964 * 9932.13)
      // sell: 339.862196212 = (0.031962964 * 10633)
      // percent: 1.07056592
      {
        amount: 317.460317,
        profit: {
          source: 'otherFake',
          sourceName: 'Other Fake Exchange',
          dest: 'fake',
          destName: 'Fake Exchange',
          coin: 'btc',
          profitPercent: 1.0705659309735172, // close enough to 1.07056592
        },
      },
      // [eth] otherFake (asks) -> fake (bids)
      // buy: 317.460317 = (0.418382558 * 758.78)
      // sell: 328.85467311 = (0.1299496 * 796.7) + (0.288432958 * 781.2)
      //                         103.53084632     +     225.32382679
      // percent: 1.035892222
      {
        amount: 317.460317,
        profit: {
          source: 'otherFake',
          sourceName: 'Other Fake Exchange',
          dest: 'fake',
          destName: 'Fake Exchange',
          coin: 'eth',
          profitPercent: 1.0358922206322418, // close enough to 1.035892222,
        },
      },
    ])

    expect(profitCache.loadAll.mock.calls[1][0]).toEqual([
      // [btc] otherFake (asks) -> fake (bids)
      // equals to 317.460317
      {
        amount: 1587.301585,
        profit: {
          source: 'otherFake',
          sourceName: 'Other Fake Exchange',
          dest: 'fake',
          destName: 'Fake Exchange',
          coin: 'btc',
          profitPercent: 1.0705659309735174, // close enough to 1.07056592,
        },
      },
      // [eth] otherFake (asks) -> fake (bids)
      // buy: 1587.301585 = (2.091912788 * 758.78)
      // sell: 1626.616477998 = (0.1299496 * 796.7)     // 103.53084632
      //                        + (0.39477809 * 781.2)  // 308.400643908
      //                        + (1.22345574 * 776.5)  // 950.01338211
      //                        + (0.343729358 * 770.0) // 264.67160566
      // percent: 1.024768383
      {
        amount: 1587.301585,
        profit: {
          source: 'otherFake',
          sourceName: 'Other Fake Exchange',
          dest: 'fake',
          destName: 'Fake Exchange',
          coin: 'eth',
          profitPercent: 1.0247683824465152, // close enough to 1.024768383,
        },
      },
    ])

    expect(profitCache.loadAll.mock.calls[2][0]).toEqual([
      // [btc] otherFake (asks) -> fake (bids)
      // buy: 3174.60317 = (0.319629643 * 9932.13)
      // sell: 3381.739197197 = (0.2 * 10633)               // 2126.6
      //                        + (0.05701809 * 10570.69)   // 602.720553782
      //                        + (0.062611553 * 10420.10)  // 652.418643415
      // percent: 1.065247849
      {
        amount: 3174.60317,
        profit: {
          source: 'otherFake',
          sourceName: 'Other Fake Exchange',
          dest: 'fake',
          destName: 'Fake Exchange',
          coin: 'btc',
          profitPercent: 1.0652478499408684, // close enough to 1.06636698
        },
      },
      // [eth] otherFake (asks) -> fake (bids)
      // buy: 3174.60317 = (3.85549774 * 758.78) + (0.327749033 * 760.12)
      // sell: 3233.122270702 = (0.1299496 * 796.7)     // 103.53084632
      //                        + (0.39477809 * 781.2)  // 308.400643908
      //                        + (1.22345574 * 776.5)  // 950.01338211
      //                        + (0.52437547 * 770.0)  // 403.7691119
      //                        + (1.910687873 * 768.0) // 1467.408286464
      // percent: 1.018433517
      {
        amount: 3174.60317,
        profit: {
          source: 'otherFake',
          sourceName: 'Other Fake Exchange',
          dest: 'fake',
          destName: 'Fake Exchange',
          coin: 'eth',
          profitPercent: 1.018433516709298, // close enough to 1.018433517
        },
      },
    ])
  })
})
