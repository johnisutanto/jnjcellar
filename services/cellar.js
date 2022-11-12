import sequelize, { CellarDB } from "../utils/sequelize"
import { Op } from "sequelize"

export const getEmptyShelves = async () => {
  const results = await CellarDB.findAll({
    attributes: ["Location"],
    where: {
      CellarId: { [Op.eq]: "STAIRCASE" },
      WineId: { [Op.is]: null },
    },
  })
  const locations = results.map((result) => result.Location)
  return locations
}

export const addWineToCellar = async (id, locations) => {
  const [results] = await sequelize.query(
    `EXECUTE AddBottleToCellar :id, :locations`,
    {
      raw: true,
      type: sequelize.QueryTypes.SELECT,
      replacements: { id, locations: locations.join(",") },
    }
  )
  return results
}

export const removeWineFromCellar = async (id, location) => {
  const [results] = await sequelize.query(
    `EXECUTE RemoveBottleFromCellar :id, :location`,
    {
      raw: true,
      type: sequelize.QueryTypes.SELECT,
      replacements: { id, location },
    }
  )
  return results
}

export const getBottleCounts = async () => {
  const results = await sequelize.query(
    `SELECT count(*) as total FROM 
  (SELECT
    Id,
    value
  FROM Wine
  CROSS APPLY STRING_SPLIT(Location, '|')) mywine`,
    { raw: true, type: sequelize.QueryTypes.SELECT }
  )
  return results[0].total
}
