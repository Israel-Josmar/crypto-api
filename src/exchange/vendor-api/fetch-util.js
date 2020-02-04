import get from 'lodash.get'

export const fetchByConfig = async (config) => {
  const response = await fetch(config.fetch.url)
  const value = await getResult(response, config.result)

  return value
}

const getResult = async (response, resultConfig) => {
  const json = await response.json()

  if (!resultConfig) {
    return json
  }

  return get(json, resultConfig)
}
