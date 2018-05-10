import {
  loadAll,
  getAll,
  invalidate,
} from './book-dao'

test('should return populated data', async () => {
  invalidate()

  loadAll([
    {
      exchangeId: 'fake',
      exchangeName: 'FakeExchange',
      coin: 'btc',
      asks: [{ a: 'a' }],
      bids: [{ b: 'b' }],
    },
    {
      exchangeId: 'fake',
      exchangeName: 'FakeExchange',
      coin: 'eth',
      asks: [{ c: 'c' }],
      bids: [{ d: 'd' }],
    },
    {
      exchangeId: 'otherFake',
      exchangeName: 'OtherFakeExchange',
      coin: 'btc',
      asks: [{ e: 'e' }],
      bids: [{ f: 'f' }],
    },
    {
      exchangeId: 'otherFake',
      exchangeName: 'OtherFakeExchange',
      coin: 'eth',
      asks: [{ g: 'g' }],
      bids: [{ h: 'h' }],
    },
  ])
  const cache = await getAll()

  expect(cache).toEqual([
    {
      exchangeId: 'fake',
      exchangeName: 'FakeExchange',
      btc: {
        asks: [{ a: 'a' }],
        bids: [{ b: 'b' }],
      },
      eth: {
        asks: [{ c: 'c' }],
        bids: [{ d: 'd' }],
      },
    },
    {
      exchangeId: 'otherFake',
      exchangeName: 'OtherFakeExchange',
      btc: {
        asks: [{ e: 'e' }],
        bids: [{ f: 'f' }],
      },
      eth: {
        asks: [{ g: 'g' }],
        bids: [{ h: 'h' }],
      },
    },
  ])
})
