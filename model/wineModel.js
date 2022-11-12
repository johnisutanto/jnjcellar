import { DataTypes } from "sequelize"

const Wine = (sequelize) => {
  const attributes = {
    Id: { type: DataTypes.STRING, primaryKey: true },
    Country: { type: DataTypes.STRING },
    Region: { type: DataTypes.STRING },
    Producer: { type: DataTypes.STRING },
    Varietal: { type: DataTypes.STRING },
    Appellation: { type: DataTypes.STRING },
    Vintage: { type: DataTypes.SMALLINT },
    Color: { type: DataTypes.TINYINT },
    Rating: { type: DataTypes.TINYINT },
    Name: { type: DataTypes.STRING },
    AlcoholPct: { type: DataTypes.DECIMAL },
    Price: { type: DataTypes.DECIMAL },
    Location: { type: DataTypes.STRING },
    ImageUrl: { type: DataTypes.STRING },
    IsFavorite: { type: DataTypes.TINYINT },
    DrinkDate: { type: DataTypes.STRING },
    BottleCount: { type: DataTypes.INTEGER },
  }
  return sequelize.define("Wines", attributes, {
    tableName: "Wine",
    freezeTableName: true,
    timestamps: false,
  })
}

export default Wine
