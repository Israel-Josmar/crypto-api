import express from 'express'
import { getDashboard } from './app/dashboard'
import * as pricesCache from './exchange/data-access/prices-dao'
import * as pricesService from './exchange/services/cripto-prices'
import * as exchangeDAO from './exchange/data-access/exchange-dao'
import * as exchangeSDK from './exchange/vendor-api/exchanges-sdk'

const server = express()
const port = 3001

server.get('/dashboard', async (req, res) => {
  // TODO: move this logic to a background job
  await simulateBackgroundJobAlreadyRunned()

  try {
    const chosenExchangeId = await exchangeDAO.getChosenExchangeId()
    const dashboard = await getDashboard(pricesCache, chosenExchangeId)
    return res.send(dashboard)
  } finally {
    res.status(500).end()
  }
})

const simulateBackgroundJobAlreadyRunned = async () => {
  // prepopulate cache
  await pricesService.populateCache({ pricesCache, exchangeDAO, exchangeSDK })

  // TODO: on a real background job
  //  prepopulate profit cache with some predefined amounts
  // ex.: await profitService.populateProfitCache({ ..., amount: predefinedAmount  })
}

server.listen(port, () => {
  console.log(`Server listening on port ${port}!`) // eslint-disable-line
})

process.on('uncaughtException', function (error) {
  console.log('Uncaught Exception: ', error)
})

process.on('unhandledRejection', function (reason, p) {
  console.log('Unhandled Rejection at: Promise ', p, ' reason: ', reason)
})
