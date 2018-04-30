import { fetchByConfig } from './fetch-util'
import { expandJson } from 'expand-json'
import get from 'lodash.get'

const transformList = {
  /*
   * [[ $price, $amount ], ...]
  */
  fromArrayOfArray: (arr) => arr.map(([price, amount]) => ({ price, amount })),
  /*
   * [{ price: $price, amount: $amount }], ...]
  */
  fromArrayOfObject: (arr) => arr,
}

export const getBook = async (exchange, payload) => {
  const config = expandJson(exchange.api, payload)
  const result = await fetchByConfig(config)

  const {
    bids: bidsConfig,
    asks: asksConfig,
  } = config.transform

  const rawBids = get(result, bidsConfig.path)
  const rawAsks = get(result, asksConfig.path)

  const transformBids = transformList[bidsConfig.method]
  const transformAsks = transformList[asksConfig.method]

  const book = {
    bids: transformBids(rawBids),
    asks: transformAsks(rawAsks),
  }

  return book
}

// FIXME: remove as soon as finish chaning ticker to booking
export const getPrice = getBook
