export const WINE_COLUMNS = [
  { jsonName: "country", sqlName: "Country" },
  { jsonName: "region", sqlName: "Region" },
  { jsonName: "producer", sqlName: "Producer" },
  { jsonName: "varietal", sqlName: "Varietal" },
  { jsonName: "appellation", sqlName: "Appellation" },
  {
    jsonName: "color",
    sqlName: "Color",
    transform: (val) => (val === 0 ? "Red" : "White"),
  },
  { jsonName: "rating", sqlName: "Rating" },
  { jsonName: "alcoholPct", sqlName: "AlcoholPct" },
  //{ jsonName: "dateAcquired", sqlName: "DateAcquired" },
  // { jsonName: "isFavorite", sqlName: "IsFavorite" },
]

export const WineColors = [
  { value: 0, label: "Red" },
  { value: 1, label: "White" },
  { value: 2, label: "Rose" },
]
