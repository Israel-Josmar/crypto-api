import { fetchByConfig } from './fetch-util'
import { expandJson } from 'expand-json'

export const getBook = async (exchange, payload) => {
  const config = expandJson(exchange.api, payload)
  const result = await fetchByConfig(config)

  return result
}

// FIXME: remove as soon as finish chaning ticker to booking
export const getPrice = getBook
