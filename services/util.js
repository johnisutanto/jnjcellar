export const groupByCellar = (cellarResult) =>
  cellarResult.reduce((cellars, location) => {
    const cellarName = location.CellarId
    cellars[cellarName] = cellars[cellarName] ?? []
    cellars[cellarName].push(location.Location)
    return cellars
  }, {})
