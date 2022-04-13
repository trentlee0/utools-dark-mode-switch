module.exports = {
  set(key, value) {
    utools.dbStorage.setItem(key, value)
  },
  get(key) {
    return utools.dbStorage.getItem(key)
  }
}
