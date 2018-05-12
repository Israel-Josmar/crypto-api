import express from 'express'
import { getDashboard } from './app/dashboard'
import * as bookCache from './exchange/data-access/book-dao'
import * as profitCache from './exchange/data-access/profit-dao'
import * as bookService from './exchange/services/populate-book-cache'

const server = express()
const port = 3001

server.get('/dashboard', async (req, res) => {
  // TODO: move this logic to a background job
  await simulateBackgroundJobAlreadyRunned()

  try {
    // TODO: get amount from incoming request
    const amount = 317.460317

    const dashboard = await getDashboard({ amount })

    return res.send(dashboard)
  } finally {
    res.status(500).end()
  }
})

const simulateBackgroundJobAlreadyRunned = async () => {
  // invalidate caches, populate book cache, prepopulate profit cache

  // invalidate caches
  await Promise.all([
    bookCache.invalidate(),
    profitCache.invalidate(),
  ])

  // prepopulate book cache
  await bookService.populateCache()

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
