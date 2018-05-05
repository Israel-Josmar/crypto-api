const mock = jest.genMockFromModule('../exchange-dao')

mock.getAllExchanges.mockResolvedValue([])
mock.getAllCurrencies.mockResolvedValue([])
mock.getChosenExchangeId.mockResolvedValue('fake')

module.exports = mock
