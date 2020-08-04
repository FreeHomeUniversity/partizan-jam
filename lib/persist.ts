const persist = (config, key: string) => (set, get, api) => {
  const initialState = config(
    (args) => {
      set(args)
      window.sessionStorage.setItem(key, JSON.stringify(get()))
    },
    get,
    api,
  )

  const restoredState = typeof window === 'undefined' ? {} : JSON.parse(sessionStorage.getItem('state'))

  return {
    ...initialState,
    ...restoredState,
  }
}

export default persist
