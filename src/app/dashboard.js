const data = require('../../data.json')

export const getDashboard = async ({ getPrice }) => {
  const chosenExchangeId = data.chosenExchangeId
  const currencies = data.currencies
  const allExchanges = data.exchanges

  const chosenExchange = allExchanges.find((exchange) => exchange.id === chosenExchangeId)

  const exchanges = allExchanges.filter((exchange) => exchange.id !== chosenExchangeId)

  const chosenExchangeCriptos = chosenExchange.criptos

  // call getPrice for usd
  const usd = Number.parseFloat(await getPrice(currencies.usd), 10)

  const getPriceByCurrency = createGetPriceByCurrency(getPrice, chosenExchange, 'brl')
  const chosenExchangePricesPromises = chosenExchangeCriptos.map(getPriceByCurrency)
  const chosenExchangePrices = await Promise.all(chosenExchangePricesPromises)

  // call getPrice for each exchange
  const getExchangeCriptoPrices = createGetExchangeCriptoPrices(getPrice, chosenExchangeCriptos)
  const criptoPrices = await Promise.all(
    exchanges.map(getExchangeCriptoPrices).reduce((result, nextArr) => result.concat(nextArr), []),
  )

  // convert each exchange return for brl (using usd)
  const convertCriptoPricesToBrl = createConvertCriptoPricesToBrl(usd)
  const criptoPricesBrl = criptoPrices.map(convertCriptoPricesToBrl)

  // for each getPrice (brl) return diff to chosen exchange
  const getProfit = createGetProfit(chosenExchangePrices)
  const exchangesProfits = criptoPricesBrl.map(getProfit)

  // return assembled answer
  const dashboard = exchangesProfits.map(getDashboardEntry)

  return dashboard
}

const createGetExchangeCriptoPrices = (getPrice, chosenExchangeCriptos) => (exchange) => {
  const getPriceByCurrency = createGetPriceByCurrency(getPrice, exchange, 'usd')

  return exchange.criptos
    .filter((cripto) => chosenExchangeCriptos.includes(cripto))
    .map(getPriceByCurrency)
}

const createGetPriceByCurrency = (getPrice, exchange, currency) => (cripto) => {
  return getPrice(exchange, { currency, cripto }).then((price) => ({
    exchangeId: exchange.id,
    exchangeName: exchange.name,
    cripto: cripto,
    price: Number.parseFloat(price, 10),
  }))
}

const createConvertCriptoPricesToBrl = (usd) => (exchangePrice) => ({
  ...exchangePrice,
  price: exchangePrice.price * usd,
})

const createGetProfit = (chosenExchangePrices) => (criptoPrice) => {
  const chosenExchangePrice = chosenExchangePrices
    .find((chosenExchangePrice) => chosenExchangePrice.cripto === criptoPrice.cripto)

  return {
    ...criptoPrice,
    value: chosenExchangePrice.price - criptoPrice.price,
    percent: chosenExchangePrice.price / criptoPrice.price,
    price: undefined,
  }
}

const getDashboardEntry = (profit) => ({
  exchange: profit.exchangeName,
  coin: profit.cripto,
  profit: profit.value,
  profitPercent: profit.percent,
})
