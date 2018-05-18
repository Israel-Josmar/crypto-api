// environment bootstrap
import 'regenerator-runtime/runtime'
global.fetch = require('node-fetch')

import { getDashboard } from './app/dashboard'

/*
 * npx sls invoke local \
 *  -f dashboard \
 *  -d '{"queryStringParameters": {"amount":"1000", "currency": "brl"}}'
 */

export const dashboard = async (event, context, callback) => {
  const userAmount = event.queryStringParameters.amount
  const currency = event.queryStringParameters.currency

  const dashboard = await getDashboard({ userAmount, currency })

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: dashboard,
      input: event,
    }),
  }

  callback(null, response)
}
