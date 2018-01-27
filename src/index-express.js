import express from 'express'
import { getDashboard } from './app/dashboard'
import { getPrice } from './exchange-sdk/sdk'

const server = express()
const port = 3000

server.get('/dashboard', async (req, res) => {
  try {
    const dashboard = await getDashboard({ getPrice })
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
