import fetchThis from 'fetch-this'
import Handlebars from 'handlebars'
import get from 'lodash.get'

export const getPrice = async (exchange, payload) => {
  const response = await fetchThis(exchange.api.fetch, payload)
  const body = await response.json()

  const resultPath = Handlebars.compile(exchange.api.result)(payload)

  return get(body, resultPath)
}
