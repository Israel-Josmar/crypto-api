import keyBy from 'lodash.keyby'

import * as bookCache from '../data-access/book-dao'
import * as exchangeDAO from '../data-access/exchange-dao'
import * as exchangeSDK from '../vendor-api/exchanges-sdk'
import * as currencySDK from '../vendor-api/currency-sdk'

export const populateCache = async () => {
  const [
    exchanges,
    currencies,
  ] = await Promise.all([
    exchangeDAO.getAllExchanges(),
    exchangeDAO.getAllCurrencies(),
  ])

  // fetch currencies convesions to USD
  const currencyPrices = await Promise.all(
    currencies.map((currency) => {
      return currencySDK
        .getPrice(currency)
        .then((value) => ({
          id: currency.id,
          value: Number.parseFloat(value),
        }))
    }),
  )

  const currencyPriceMap = keyBy(currencyPrices, (currencyPrice) => currencyPrice.id)

  // fetch prices for all coins of all exchanges
  const getExchangeBooks = createGetExchangeBooks(currencyPriceMap)
  const books = await Promise.all(
    exchanges.map(getExchangeBooks).reduce(flatten, []),
  )

  // populate a cache
  await bookCache.loadAll(books)
}

const flatten = (result, nextArr) => result.concat(nextArr)

const createGetExchangeBooks = (currencyPriceMap) => (exchange) => {
  const getBookByCurrency = createGetBookByCurrency(exchange, currencyPriceMap)

  return exchange.coins
    .map(getBookByCurrency)
}

const createGetBookByCurrency = (exchange, currencyPriceMap) => (coin) => {
  const currency = exchange.currency || 'usd'
  const currencyValue = (currencyPriceMap[currency] || {}).value || 1

  const priceToUSD = createPriceToUSD(currencyValue)

  return exchangeSDK.getBook(exchange, { currency, coin }).then((book) => ({
    exchangeId: exchange.id,
    exchangeName: exchange.name,
    coin: coin,
    asks: book.asks.map(priceToUSD),
    bids: book.bids.map(priceToUSD),
  }))
}

const createPriceToUSD = (currencyValue) => ({ price, amount }) => ({
  price: Number.parseFloat(price * currencyValue),
  amount: Number.parseFloat(amount),
})
