import { DataTypes } from "sequelize"

const History = (sequelize) => {
  const attributes = {
    comment: { type: DataTypes.STRING },
    user: { type: DataTypes.STRING },
  }
  return sequelize.define("History", attributes, {
    tableName: "History",
    freezeTableName: true,
  })
}

export default History
