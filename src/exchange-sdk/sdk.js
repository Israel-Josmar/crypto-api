import { fetchThis, getResult } from 'fetch-this'
import { expandJson } from 'expand-json'

export const getPrice = async (exchange, payload) => {
  const data = expandJson(exchange.api, payload)

  const response = await fetchThis(data.fetch)
  const value = await getResult(response, data.result)

  return value
}
