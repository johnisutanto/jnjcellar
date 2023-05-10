import sequelize, { CellarDB } from "../utils/sequelize"
import { Op } from "sequelize"
import { groupByCellar } from "./util"

export const getEmptyShelves = async () => {
  const results = await CellarDB.findAll({
    // attributes: ["Location"],
    where: {
      // CellarId: { [Op.eq]: "STAIRCASE" },
      WineId: { [Op.is]: null },
    },
  })
  const locations = groupByCellar(results)
  return locations
}

export const addWineToCellar = async (id, locations, cellarId) => {
  const [results] = await sequelize.query(
    `EXECUTE AddBottleToCellar :id, :locations, :cellarId`,
    {
      raw: true,
      type: sequelize.QueryTypes.SELECT,
      replacements: { id, locations: locations.join(","), cellarId },
    }
  )
  return results
}

export const removeWineFromCellar = async (id, location, cellarId) => {
  const [results] = await sequelize.query(
    `EXECUTE RemoveBottleFromCellar :id, :location, :cellarId`,
    {
      raw: true,
      type: sequelize.QueryTypes.SELECT,
      replacements: { id, location, cellarId },
    }
  )
  return results
}

export const getBottleCounts = async () => {
  const count = await CellarDB.count({
    where: {
      WineId: { [Op.ne]: null },
    },
  })
  return count
}
