let cache = {}

export const invalidate = async () => cache = {}

export const loadAll = async (data) => {
  for (const i in data) {
    const entry = data[i]
    if (!cache[entry.exchangeId]) {
      cache[entry.exchangeId] =  {
        exchangeId: entry.exchangeId,
        exchangeName: entry.exchangeName,
      }
    }
    cache[entry.exchangeId][entry.coin] = {
      bids: entry.bids,
      asks: entry.asks,
    }
  }
}

export const getAll = async () => Object.values(cache)
