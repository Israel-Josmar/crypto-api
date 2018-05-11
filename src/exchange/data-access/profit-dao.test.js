import {
  loadAll,
  getBest,
} from './profit-dao'

test('should return populated data', async () => {
  await loadAll([
    { amount: 10, profit: 'a' },
    { amount: 10, profit: 'b' },
    { amount: 11, profit: 'c' },
    { amount: 12, profit: 'd' },
  ])

  expect(await getBest(10)).toEqual(['a', 'b'])
  expect(await getBest(11)).toEqual(['c'])
  expect(await getBest(12)).toEqual(['d'])
})
