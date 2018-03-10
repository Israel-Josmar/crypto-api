import { fetchByConfig } from './fetch-util'
import { expandJson } from 'expand-json'

export const getPrice = async (exchange, payload) => {
  const config = expandJson(exchange.api, payload)
  const result = await fetchByConfig(config)

  return result
}
