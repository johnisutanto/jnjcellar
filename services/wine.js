import sequelize, { WineDB, CellarDB } from "../utils/sequelize"
import { Op } from "sequelize"

const PAGE_SIZE = 15

export const getWines = async (queries) => {
  const { page, ...params } = queries
  const offset = page * PAGE_SIZE
  const { count, rows } = await WineDB.findAndCountAll({
    where: Object.fromEntries(
      Object.entries(params || {}).map(([key, value]) => {
        if (key === "Varietal") {
          return [key, { [Op.like]: value }]
        }
        return [key, { [Op.eq]: value }]
      })
    ),
    offset,
    limit: PAGE_SIZE,
  })
  return {
    results: rows,
    totalCount: count,
  }
}

export const getWine = async (id) => {
  const wine = await WineDB.findByPk(id)
  const results = await CellarDB.findAll({
    where: {
      WineId: { [Op.eq]: id },
    },
  })
  wine.Location = results.map((result) => result.Location).join("|")
  return wine
}

const toSqlCase = (str) => str.charAt(0).toUpperCase() + str.slice(1)

export const insertWine = async (wine) => {
  const fields = Object.keys(wine).map(key => toSqlCase(key))
  const wineSql = Object.fromEntries(Object.entries(wine).map(([key, value]) => [toSqlCase(key), value]))
  const newWine = await WineDB.create(wineSql, { fields })
  return newWine
}

export const getWineFilters = async () => {
  const [results] = await sequelize.query(
    `
DECLARE @RC int;
DECLARE @countries nvarchar(max);
DECLARE @regions nvarchar(max);
DECLARE @producers nvarchar(max);
DECLARE @varietals nvarchar(max);
DECLARE @appellations nvarchar(max);
EXECUTE RetrieveWineFilters @countries OUTPUT, @regions OUTPUT, @producers OUTPUT, @varietals OUTPUT, @appellations OUTPUT;
SELECT @countries as countries, @regions as regions, @producers as producers, @varietals as varietals, @appellations as appellations;
  `,
    { raw: true, type: sequelize.QueryTypes.SELECT }
  )

  const filters = Object.fromEntries(
    Object.entries(results).map(([key, value]) => [
      key,
      JSON.parse(value).map((obj) => Object.values(obj)[0]),
    ])
  )
  return filters
}
