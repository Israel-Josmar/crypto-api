import { fetchThis, getResult } from 'fetch-this'
import Handlebars from 'handlebars'

Handlebars.registerHelper('upper', (str) => {
  if (!str || typeof str !== 'string') {
    return ''
  }
  return str.toUpperCase()
})

export const getPrice = async (exchange, payload) => {
  const compile = (template) => {
    if (!template) return ''
    return Handlebars.compile(template)(payload)
  }

  const data = {
    fetch: {
      url: compile(exchange.api.fetch.url),
    },
    result: compile(exchange.api.result),
  }

  const response = await fetchThis(data)
  const value = await getResult(response, data)

  return value
}
