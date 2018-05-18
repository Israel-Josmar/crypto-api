import express from 'express'
import { getDashboard } from './app/dashboard'

const server = express()
const port = 3001

server.get('/dashboard', async (req, res) => {
  try {
    const userAmount = req.query.amount
    const currency = req.query.currency

    const dashboard = await getDashboard({ userAmount, currency })

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
