let cache

export const loadAll = async (data) => {
  cache = data
}

export const getAll = async () => cache
