let cache = {}

export const invalidate = async () => cache = {}

export const getBest = async (price) => {
  return cache[price] || null
}

export const loadAll = async (profits) => {
  for (const profit of profits) {
    if (!cache[profit.amount]) {
      cache[profit.amount] = []
    }
    cache[profit.amount].push(profit.profit)
  }
}
