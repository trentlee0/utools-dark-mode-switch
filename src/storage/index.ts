export default {
  set(key: string, value: any) {
    utools.dbStorage.setItem(key, value)
  },
  get(key: string) {
    return utools.dbStorage.getItem(key)
  }
}
