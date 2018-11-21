// environment bootstrap
import 'regenerator-runtime/runtime'
global.fetch = require('node-fetch')

import middy from 'middy'
import { cors } from 'middy/middlewares'
import { getDashboard } from './app/dashboard'

const dashboardHandler = async (event, context, callback) => {
  const userAmount = event.queryStringParameters.amount
  const currency = event.queryStringParameters.currency

  const dashboard = await getDashboard({ userAmount, currency })

  const response = {
    statusCode: 200,
    body: JSON.stringify(dashboard),
  }

  callback(null, response)
}

export const dashboard = middy(dashboardHandler)
  .use(cors())
