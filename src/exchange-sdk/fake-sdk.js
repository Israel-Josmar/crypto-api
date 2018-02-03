let urlAndResultsCache = {}

export const loadFakeReturns = (urlAndResults) => {
  urlAndResultsCache = urlAndResults
}

export const resetFakeReturns = () => {
  urlAndResultsCache = {}
}

export const getPrice = async (exchange, payload) => {
  if (!payload) {
    return urlAndResultsCache[exchange.id]
  }

  return urlAndResultsCache[exchange.id][payload.cripto]
}
