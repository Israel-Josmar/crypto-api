import flow from 'lodash.flow'
import reverse from 'lodash.reverse'
import sortBy from 'lodash.sortby'
import keyBy from 'lodash.keyby'

export const getDashboard = async (pricesCache, chosenExchangeId) => {
  // get targeted cripto prices from cache
  const prices = await pricesCache.getAll()

  // discover profits from given prices
  const profits = getProfits(prices, chosenExchangeId)

  // build the final dashboard
  const dashboard = buildDashboard(profits)

  return dashboard
}

const getProfits = (prices, chosenExchangeId) => {
  const isChosenExchange = (price) => price.exchangeId === chosenExchangeId
  const isOtherExchange = (price) => !isChosenExchange(price)

  // hashmap of prices by coin id
  const targetPricesMap = flow([
    _ => _.filter(isChosenExchange),
    _ => keyBy(_, (price) => price.coin),
  ])(prices)

  // list of prices for other criptos that has a target price
  const otherPrices = prices
    .filter(isOtherExchange)
    .filter((price) => targetPricesMap[price.coin])

  const profits = otherPrices.map((price) => {
    const targetPrice = targetPricesMap[price.coin]
    return ({
      ...price,
      percent: Number.parseFloat(targetPrice.value, 10) / Number.parseFloat(price.value, 10),
    })
  })

  return profits
}

const toDashboardEntry = (profit) => ({
  exchangeId: profit.exchangeId,
  exchange: profit.exchange,
  coin: profit.coin,
  profitPercent: profit.percent,
})

const buildDashboard = (profits) => (
  flow([
    (_) => _.map(toDashboardEntry),
    (_) => sortBy(_, (el) => el.profitPercent),
    reverse,
  ])(profits)
)
