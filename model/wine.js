const WINE_COLUMNS = [
  { name: "Id", type: "NVarChar" },
  { name: "Country", type: "NVarChar" },
  { name: "Region", type: "NVarChar" },
  { name: "Producer", type: "NVarChar" },
  { name: "Varietal", type: "NVarChar" },
  { name: "Appellation", type: "NVarChar" },
  { name: "Vintage", type: "SmallInt" },
  {
    name: "Color",
    transform: (val) => (val === 0 ? "Red" : val === 1 ? "White" : "Rose"),
    type: "TinyInt",
  },
  { name: "Rating", isNumber: true, type: "TinyInt" },
  { name: "Name", type: "NVarChar" },
  {
    name: "AlcoholPct",
    isNumber: true,
    type: "Decimal",
    label: "Alcohol",
    transform: (val) => `${val.toFixed(2)} %`,
  },
  // { name: "DateAcquired", type: "Date" },
  {
    name: "Price",
    isNumber: true,
    type: "Decimal",
    transform: (val) => `$ ${val.toFixed(2)}`,
  },
  { name: "Location", type: "NVarChar" },
  { name: "ImageUrl", type: "NVarChar" },
  { name: "IsFavorite", type: "Bit" },
  { name: "DrinkDate", type: "VarChar" },
  { name: "BottleCount", type: "Int" },
  { name: "Maturity", type: "NVarChar" },
]

module.exports = { WINE_COLUMNS }
