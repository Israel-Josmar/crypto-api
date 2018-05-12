import { fetchByConfig } from './fetch-util'
import { expandJson } from 'expand-json'

export const getPrice = async (currency, payload) => {
  const config = expandJson(currency.api, payload)
  const value = await fetchByConfig(config)

  return value
}
