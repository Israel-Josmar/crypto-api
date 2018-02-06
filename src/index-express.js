import express from 'express'
import { getDashboard } from './app/dashboard'
import { getPrice } from './exchange-sdk/sdk'

const server = express()
const port = 3000

const data = require('../data.json')

server.get('/dashboard', async (req, res) => {
  const sdk = { getPrice }

  try {
    const dashboard = await getDashboard(sdk, data)
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
