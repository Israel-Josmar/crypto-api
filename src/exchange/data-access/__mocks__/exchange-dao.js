const mock = jest.genMockFromModule('../exchange-dao')

mock.getAllExchanges.mockResolvedValue([])
mock.getAllCurrencies.mockResolvedValue([])

module.exports = mock
