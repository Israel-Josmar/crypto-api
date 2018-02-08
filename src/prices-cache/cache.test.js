import {
  loadAll,
  getAll,
} from './cache'

test('should return populated data', async () => {
  loadAll([1, 2, 3])
  const cache = await getAll()

  expect(cache).toEqual([1, 2, 3])
})
