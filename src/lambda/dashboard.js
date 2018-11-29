// environment bootstrap
global.fetch = require('node-fetch')

import middy from 'middy'
import { cors } from 'middy/middlewares'
import { getDashboard } from '../app/dashboard'

const dashboard = async (event, context, callback) => {
  const userAmount = event.queryStringParameters.amount
  const currency = event.queryStringParameters.currency

  const dashboard = await getDashboard({ userAmount, currency })

  const response = {
    statusCode: 200,
    body: JSON.stringify(dashboard),
  }

  callback(null, response)
}

export default middy(dashboard)
  .use(cors())
