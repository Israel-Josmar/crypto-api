import express from 'express'
import { getDashboard } from './app/dashboard'
import { getAll, loadAll } from './exchange/data-access/prices-dao'
import { populateCache } from './exchange/services/cripto-prices'
import { getAllExchanges, getAllCurrencies, getChosenExchangeId } from './exchange/data-access/exchange-dao'
import { getPrice } from './exchange/vendor-api/exchanges-sdk'

const server = express()
const port = 3001

server.get('/dashboard', async (req, res) => {
  try {
    {
      // move this service call to a background job
      const pricesCache = { loadAll }
      const exchangeDAO = { getAllExchanges, getAllCurrencies }
      const exchangeSDK = { getPrice }
      await populateCache({ pricesCache, exchangeDAO, exchangeSDK })
    }

    const pricesCache = { getAll }
    const chosenExchangeId = await getChosenExchangeId()
    const dashboard = await getDashboard(pricesCache, chosenExchangeId)
    return res.send(dashboard)
  } finally {
    res.status(500).end()
  }
})

server.listen(port, () => {
  console.log(`Server listening on port ${port}!`) // eslint-disable-line
})

process.on('uncaughtException', function (error) {
  console.log('Uncaught Exception: ', error)
})

process.on('unhandledRejection', function (reason, p) {
  console.log('Unhandled Rejection at: Promise ', p, ' reason: ', reason)
})
