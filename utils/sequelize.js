import { getDbConfig } from "./dbUtil"
import { Sequelize } from "sequelize"
import Cellar from "../model/cellar"
import Wine from "../model/wineModel"

const config = getDbConfig()
const { userName, password } = config.authentication.options
const { database } = config.options

const sequelize = new Sequelize(database, userName, password, {
  host: config.server,
  dialect: "mssql",
})

export const CellarDB = Cellar(sequelize)
export const WineDB = Wine(sequelize)

export default sequelize
