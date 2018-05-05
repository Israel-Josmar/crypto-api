import { fetchThis, getResult } from 'fetch-this'

export const fetchByConfig = async (config) => {
  const response = await fetchThis(config.fetch)
  const value = await getResult(response, config.result)

  return value
}
