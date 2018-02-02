import { fetchThis, getResult } from 'fetch-this'
import Handlebars from 'handlebars'
import flow from 'lodash.flow'

Handlebars.registerHelper('upper', (str) => {
  if (!str || typeof str !== 'string') {
    return ''
  }
  return str.toUpperCase()
})

// TODO: move this logic to a new package
// perf note: "stringify/compile/parse" performs better than "recursive compile"
//  the last one performs worse as object gets larger or deeper
const compileObj = (obj, payload) => (
  flow([
    JSON.stringify,
    (_) => Handlebars.compile(_)(payload),
    JSON.parse,
  ])(obj)
)

export const getPrice = async (exchange, payload) => {
  const data = compileObj(exchange.api, payload)

  const response = await fetchThis(data)
  const value = await getResult(response, data)

  return value
}
