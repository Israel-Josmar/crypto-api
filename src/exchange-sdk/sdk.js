import fetchThis from 'fetch-this'
import Handlebars from 'handlebars'
import get from 'lodash.get'

Handlebars.registerHelper('upper', (str) => {
  if (!str || typeof str !== 'string') {
    return ''
  }
  return str.toUpperCase()
})

export const getPrice = async (exchange, payload) => {
  const response = await fetchThis(exchange.api.fetch, payload)
  const body = await response.json()

  if (!exchange.api.result) {
    return body
  }

  const resultPath = Handlebars.compile(exchange.api.result)(payload)

  return get(body, resultPath)
}
