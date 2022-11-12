import { DataTypes } from "sequelize"

const Cellar = (sequelize) => {
  const attributes = {
    Location: { type: DataTypes.STRING, primaryKey: true },
    CellarId: { type: DataTypes.STRING, primaryKey: true },
    WineId: { type: DataTypes.INTEGER },
  }
  return sequelize.define("Cellar", attributes, {
    tableName: "Cellar",
    freezeTableName: true,
    timestamps: false,
  })
}

export default Cellar
