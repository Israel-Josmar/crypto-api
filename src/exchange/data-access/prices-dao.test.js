import {
  loadAll,
  getAll,
} from './prices-dao'

test('should return populated data', async () => {
  loadAll([1, 2, 3])
  const cache = await getAll()

  expect(cache).toEqual([1, 2, 3])
})
