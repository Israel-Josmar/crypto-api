import * as G from 'generatorics'

import * as bookCache from '../data-access/book-dao'
import * as profitCache from '../data-access/profit-dao'

const permutation = G.permutation.bind(G)

export const populateCache = async ({ amount }) => {
  const books = await bookCache.getAll()

  const iterable = permutation(books, 2)

  const profits = []

  for (const [source, dest] of iterable) {
    if (source.exchangeId === dest.exchangeId) {
      continue
    }

    const coins = getTradableCoins(source, dest)

    for (const coin of coins) {
      // buy
      let buyCoinAmount = 0
      let amountLeftToBuy = amount

      for (const { price, amount: coinAmount } of source[coin].asks) {
        // FIXME: possible float approximation issue here
        const possibleCoinAmount = amountLeftToBuy / price
        const hasEnoughCoinAmount = coinAmount >= possibleCoinAmount
        if (hasEnoughCoinAmount) {
          buyCoinAmount += possibleCoinAmount
          amountLeftToBuy = 0
          break
        }
        amountLeftToBuy -= coinAmount * price
        buyCoinAmount += coinAmount
      }
      // FIXME: what if doesn't have enough asks selling to required amount?

      // sell
      let sellPrice = 0
      let coinsRemainingToSell = buyCoinAmount

      for (const { price, amount: coinAmount } of dest[coin].bids) {
        const hasEnoughCoinAmount = coinAmount >= coinsRemainingToSell
        if (hasEnoughCoinAmount) {
          sellPrice += coinsRemainingToSell * price
          coinsRemainingToSell = 0
          break
        }
        sellPrice += coinAmount * price
        coinsRemainingToSell -= coinAmount
      }
      // FIXME: what if doesn't have enough bids to buy the offer?

      const profitPercent = sellPrice / amount

      if (profitPercent > 1) {
        profits.push({
          amount,
          profit: {
            source: source.exchangeId,
            sourceName: source.exchangeName,
            dest: dest.exchangeId,
            destName: dest.exchangeName,
            coin: coin,
            profitPercent,
          },
        })
      }
    }
  }

  await profitCache.loadAll(profits)
}

const getTradableCoins = (source, dest) => {
  // FIXME: book cache should make it easier to know available coins

  const isCoin = key =>  !['exchangeId', 'exchangeName'].includes(key)

  const sourceCoins = Object.keys(source).filter(isCoin)
  const destCoins = Object.keys(dest).filter(isCoin)

  return intersection(sourceCoins, destCoins)
}

const intersection = (array1, array2) => {
  return array1.filter((n) => array2.indexOf(n) !== -1)
}
