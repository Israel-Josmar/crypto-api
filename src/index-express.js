import express from 'express'
import { getDashboard } from './app/dashboard'
import { getAll } from './prices-cache/cache'

const server = express()
const port = 3001

server.get('/dashboard', async (req, res) => {
  const pricesCache = { getAll }

  try {
    // FIXME: missing chosenExchangeId
    const dashboard = await getDashboard(pricesCache/* , chosenExchangeId*/)
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
