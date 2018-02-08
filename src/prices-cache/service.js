import keyBy from 'lodash.keyby'

export const populateCache = async ({ pricesCache, exchangeDAO, exchangeSDK }) => {
  const [
    exchanges,
    currencies,
  ] = await Promise.all([
    exchangeDAO.getAllExchanges(),
    exchangeDAO.getAllCurrencies(),
  ])

  // fetch currencies price (on USD)
  const currencyPrices = await Promise.all(
    currencies.map((currency) => {
      return exchangeSDK
        .getPrice(currency)
        .then((value) => ({
          id: currency.id,
          value: Number.parseFloat(value),
        }))
    }),
  )

  const currencyPriceMap = keyBy(currencyPrices, (currencyPrice) => currencyPrice.id)

  // fetch prices for all coins of all exchanges
  const getExchangeCriptoPrices = createGetExchangeCriptoPrices(exchangeSDK.getPrice, currencyPriceMap)
  const prices = await Promise.all(
    exchanges.map(getExchangeCriptoPrices).reduce(flatten, []),
  )

  // populate a cache
  await pricesCache.loadAll(prices)
}

const flatten = (result, nextArr) => result.concat(nextArr)

const createGetExchangeCriptoPrices = (getPrice, currencyPriceMap) => (exchange) => {
  const getPriceByCurrency = createGetPriceByCurrency(getPrice, exchange, currencyPriceMap)

  return exchange.coins
    .map(getPriceByCurrency)
}

const createGetPriceByCurrency = (getPrice, exchange, currencyPriceMap) => (coin) => {
  const currency = exchange.currency || 'usd'
  const currencyValue = (currencyPriceMap[currency] || {}).value

  return getPrice(exchange, { currency, coin }).then((value) => ({
    exchangeId: exchange.id,
    exchange: exchange.name,
    coin: coin,
    value: Number.parseFloat(value, 10) * (currencyValue || 1),
  }))
}
