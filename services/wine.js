import sequelize, { WineDB, CellarDB } from "../utils/sequelize"
import { Op } from "sequelize"
import { groupByCellar } from "./util"
import { isNil, omit } from "lodash"

const PAGE_SIZE = 15

export const getWines = async (queries) => {
  const { page, ...params } = queries
  const offset = page * PAGE_SIZE
  const whereQuery = Object.fromEntries(
    Object.entries(params || {})
      .filter(([key, value]) => key !== "Location")
      .map(([key, value]) => {
        if (key === "Varietal") {
          return [key, { [Op.like]: `%${value}%` }]
        }
        return [key, { [Op.eq]: value }]
      })
  )
  if (queries.Location) {
    const selectedLocation = queries.Location.toUpperCase()
    whereQuery[Op.and] = [
      sequelize.literal(
        `EXISTS (SELECT 1 FROM Cellar AS cellar WHERE Wines.Id = cellar.WineId AND cellar.CellarId = '${selectedLocation}')`
      ),
    ]
  }
  const { count, rows } = await WineDB.findAndCountAll({
    where: whereQuery,
    order: [["Rating", "DESC"], ["Id"]],
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
  const locations = await CellarDB.findAll({
    where: {
      WineId: { [Op.eq]: id },
    },
  })
  // wine.Location = locations.map((result) => result.Location).join("|")
  wine.Location = groupByCellar(locations)
  return wine
}

const toSqlCase = (str) => str.charAt(0).toUpperCase() + str.slice(1)

export const insertWine = async (wine) => {
  const fields = Object.keys(wine).map((key) => toSqlCase(key))
  const wineSql = Object.fromEntries(
    Object.entries(wine).map(([key, value]) => [toSqlCase(key), value])
  )
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
DECLARE @maturity nvarchar(max);
EXECUTE RetrieveWineFilters @countries OUTPUT, @regions OUTPUT, @producers OUTPUT, @varietals OUTPUT, @appellations OUTPUT, @maturity OUTPUT;
SELECT @countries as countries, @regions as regions, @producers as producers, @varietals as varietals, @appellations as appellations, @maturity as maturity;
  `,
    { raw: true, type: sequelize.QueryTypes.SELECT }
  )

  const filters = Object.fromEntries(
    Object.entries(results).map(([key, value]) => [
      key,
      JSON.parse(value)
        .map((obj) => Object.values(obj)[0])
        .filter((val) => !isNil(val))
        .sort(),
    ])
  )
  filters["locations"] = ["Staircase", "Storage"]
  return filters
}

export const updateWine = async (id, wine) => {
  // const wine = await WineDB.findByPk(id)
  const fields = Object.keys(wine).map((key) => toSqlCase(key))
  const wineSql = omit(
    Object.fromEntries(
      Object.entries(wine).map(([key, value]) => [toSqlCase(key), value])
    ),
    ["Id", "Location"]
  )
  console.log(`query ${JSON.stringify(wineSql)}`)
  const updatedWine = await WineDB.update(wineSql, {
    where: {
      Id: { [Op.eq]: id },
    },
  })
  return updatedWine
}
