import data from '../../../data.json'

export const getAllExchanges = async () => data.exchanges

export const getAllCurrencies = async () => data.currencies

export const getChosenExchangeId = async () => data.chosenExchangeId
