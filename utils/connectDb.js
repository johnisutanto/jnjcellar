import { getDbConfig } from "./dbUtil"
import { Connection, Request, TYPES } from "tedious"
import { WINE_COLUMNS } from "../model/wine"
import { isEmpty } from "lodash"

const WINE_COLUMN_MAPPING = {
  id: 0,
  country: 1,
  region: 2,
  producer: 3,
  varietal: 4,
  appellation: 5,
  vintage: 6,
  color: 7,
  rating: 8,
  name: 9,
  alcoholPct: 10,
  dateAcquired: 11,
  price: 12,
  location: 13,
  imageUrl: 14,
  isFavorite: 15,
}

const getConnection = () => {
  let connection = null
  if (!connection) {
    connection = new Connection(getDbConfig())
  }
  return connection
}

const partialMatchColumns = ["Varietal"]
const PAGE_SIZE = 15
export const getWines = (queries) =>
  new Promise((resolve, reject) => {
    var result = []
    var totalCount = 0

    const connection = getConnection()
    const allColumns = WINE_COLUMNS.map((col) => col.name).join(",")
    const { page, ...params } = queries
    const offset = page * PAGE_SIZE
    let whereClauses = Object.entries(params || {})
      .map(([key, value]) => {
        if (partialMatchColumns.includes(key)) {
          return `${key} LIKE '%${value.substring(1, value.length - 1)}%'`
        } else {
          return `${key} = ${value}`
        }
      })
      .join(" AND ")
    if (!isEmpty(whereClauses)) {
      whereClauses = `WHERE ${whereClauses}`
    }
    const selectString = `
      WITH WineResults AS
      (SELECT ${allColumns} FROM Wine ${whereClauses}),
      WineResultsCount AS
      (SELECT COUNT(*) AS TotalRows FROM WineResults)

      SELECT ${allColumns},TotalRows
      FROM WineResults
      CROSS JOIN WineResultsCount
      ORDER BY Rating DESC
      OFFSET ${offset} ROWS FETCH NEXT ${PAGE_SIZE} ROWS ONLY
    `
    console.log(`select string ${selectString}`)
    const request = new Request(selectString, (err) => {
      connection.close()
      if (err) {
        reject(err)
      } else {
        if (result == "" || result == null || result == "null") result = []
        resolve({
          results: result,
          totalCount,
        })
      }
    })

    request.on("columnMetadata", (columns) => {
      const cols = columns.map(col => col.colName)
      console.log(`columnMetadata ${JSON.stringify(cols)}`)
    })

    request.on("row", (columns) => {
      const wineResult = WINE_COLUMNS.reduce(
        (acc, col, index) => ({
          ...acc,
          [col.name]: columns[index].value,
        }),
        {}
      )
      totalCount = columns[WINE_COLUMNS.length].value
      result.push(wineResult)
    })

    connection.on("connect", (err) => {
      if (err) {
        reject(err)
      } else {
        connection.execSql(request)
      }
    })
    connection.connect()
  })

export const getWine = (id) =>
  new Promise((resolve, reject) => {
    var result = null

    const connection = getConnection()
    const allColumns = WINE_COLUMNS.map((col) => col.name).join(",")
    const request = new Request(
      `
      select ${allColumns}, Locations = 
       (select (cast(Location as varchar(200))+'|') as [text()]
       FROM Cellar c
       WHERE c.WineId = ${id} for XML PATH(''))
      from Wine w WHERE w.Id = ${id}
      `,
      (err) => {
        connection.close()
        if (err) {
          reject(err)
        } else {
          if (result == "" || result == null || result == "null") result = null
          resolve(result)
        }
      }
    )

    request.on("row", (columns) => {
      result = WINE_COLUMNS.reduce(
        (acc, col, index) => ({
          ...acc,
          [col.name]: columns[index].value,
        }),
        {}
      )
      result.Location = columns[columns.length - 1].value
    })

    connection.on("connect", (err) => {
      if (err) {
        reject(err)
      } else {
        connection.execSql(request)
      }
    })

    connection.connect()
  })

export const insertWine = (wine) =>
  new Promise((resolve, reject) => {
    var result = null
    console.log(`wine is = ${JSON.stringify(wine)}`)
    const connection = getConnection()
    const requiredColumns = [
      "Name",
      "Color",
      "Country",
      "Region",
      "Producer",
      "Appellation",
      "Varietal",
      "Vintage",
      "Price",
      "AlcoholPct",
      "Rating",
      "DrinkDate",
    ]
    const allSqlColumns = WINE_COLUMNS.map((col) => col.sqlName).slice(1)
    const sqlString = `INSERT INTO Wine (${requiredColumns.join(
      ","
    )}) VALUES (${requiredColumns.map((col) => `@${col}`).join(",")})`
    console.log(`SQL String = ${sqlString}`)

    const request = new Request(sqlString, (err) => {
      connection.close()
      if (err) {
        reject(err)
      } else {
        if (result == "" || result == null || result == "null") result = null
        resolve(result)
      }
    })
    requiredColumns.forEach((column) => {
      const colType =
        TYPES[WINE_COLUMNS.find((col) => col.name === column).type]
      const colName = `${column[0].toLocaleLowerCase()}${column.slice(1)}`
      const value = wine[colName]
      request.addParameter(column, colType, value)
      console.log(
        `adding col ${column} with value ${value} for column name ${colName} ${colType}`
      )
    })

    request.on("row", (columns) => {
      result = {
        producer: columns[WINE_COLUMN_MAPPING.producer].value,
        name: columns[WINE_COLUMN_MAPPING.name].value,
        vintage: columns[WINE_COLUMN_MAPPING.vintage].value,
        color: columns[WINE_COLUMN_MAPPING.color].value,
        region: columns[WINE_COLUMN_MAPPING.region].value,
        country: columns[WINE_COLUMN_MAPPING.country].value,
        rating: columns[WINE_COLUMN_MAPPING.rating].value,
      }
    })

    connection.on("connect", (err) => {
      if (err) {
        reject(err)
      } else {
        connection.execSql(request)
      }
    })

    connection.connect()
  })

export const updateWine = (id, value) =>
  new Promise((resolve, reject) => {
    var result = null

    const connection = getConnection()
    const allSqlColumns = WINE_COLUMNS.map((col) => col.sqlName).slice(1)
    const sqlString = `UPDATE Wine SET Location = @Location WHERE Id = ${id}`
    console.log(`SQL String = ${sqlString}`)
    const request = new Request(sqlString, (err) => {
      connection.close()
      if (err) {
        reject(err)
      } else {
        if (result == "" || result == null || result == "null") result = null
        resolve(result)
      }
    })
    console.log(`updating location to ${value}`)
    request.addParameter("Location", TYPES.NVarChar, value)

    connection.on("connect", (err) => {
      if (err) {
        reject(err)
      } else {
        connection.execSql(request)
      }
    })

    connection.connect()
  })

export const getFilters = (column) =>
  new Promise((resolve, reject) => {
    var result = []

    const connection = getConnection()
    const request = new Request(
      `SELECT DISTINCT ${column} FROM Wine`,
      (err) => {
        connection.close()
        if (err) {
          reject(err)
        } else {
          if (result == "" || result == null || result == "null") result = null
          resolve(result)
        }
      }
    )

    request.on("row", (res) => {
      result.push(res[0].value)
    })

    connection.on("connect", (err) => {
      if (err) {
        reject(err)
      } else {
        connection.execSql(request)
      }
    })

    connection.connect()
  })

export const getWineFilters = () =>
  new Promise((resolve, reject) => {
    var result = {}

    const connection = getConnection()
    const request = new Request(`[dbo].[RetrieveWineFilters]`, (err) => {
      connection.close()
      if (err) {
        reject(err)
      } else {
        if (result == "" || result == null || result == "null") result = null
        resolve(result)
      }
    })
    request.addOutputParameter("countries", TYPES.NVarChar)
    request.addOutputParameter("regions", TYPES.NVarChar)
    request.addOutputParameter("producers", TYPES.NVarChar)
    request.addOutputParameter("varietals", TYPES.NVarChar)
    request.addOutputParameter("appellations", TYPES.NVarChar)
    request.on("returnValue", (paramName, value, metadata) => {
      result[paramName] = JSON.parse(value).map((obj) => Object.values(obj)[0])
    })

    connection.on("connect", (err) => {
      if (err) {
        reject(err)
      } else {
        connection.callProcedure(request)
      }
    })

    connection.connect()
  })

export const getBottleCounts = (column) =>
  new Promise((resolve, reject) => {
    var result

    const connection = getConnection()
    const request = new Request(
      `SELECT count(*) FROM 
      (SELECT
        Id,
        value
      FROM Wine
      CROSS APPLY STRING_SPLIT(Location, '|')) mywine`,
      (err) => {
        connection.close()
        if (err) {
          reject(err)
        } else {
          if (result == "" || result == null || result == "null") result = null
          resolve(result)
        }
      }
    )

    request.on("row", (res) => {
      result = res[0].value
    })

    connection.on("connect", (err) => {
      if (err) {
        reject(err)
      } else {
        connection.execSql(request)
      }
    })

    connection.connect()
  })

export const getEmptyShelves = () =>
  new Promise((resolve, reject) => {
    var result = []

    const connection = getConnection()
    const request = new Request(
      `SELECT Location FROM Cellar WHERE CellarId = 'STAIRCASE' AND WineId IS NULL`,
      (err) => {
        connection.close()
        if (err) {
          reject(err)
        } else {
          if (result == "" || result == null || result == "null") result = null
          resolve(result)
        }
      }
    )

    request.on("row", (res) => {
      result.push(res[0].value)
    })

    connection.on("connect", (err) => {
      if (err) {
        reject(err)
      } else {
        connection.execSql(request)
      }
    })

    connection.connect()
  })

export const addWineToCellar = (id, locations) =>
  new Promise((resolve, reject) => {
    var result = null

    const locationsStr = locations.join(",")
    const connection = getConnection()
    const request = new Request(`[dbo].[AddBottleToCellar]`, (err) => {
      connection.close()
      if (err) {
        reject(err)
      } else {
        if (result == "" || result == null || result == "null") result = null
        resolve(result)
      }
    })
    request.addParameter("WineId", TYPES.Int, id)
    request.addParameter("Locations", TYPES.VarChar, locationsStr)

    connection.on("connect", (err) => {
      if (err) {
        reject(err)
      } else {
        connection.callProcedure(request)
      }
    })

    connection.connect()
  })

export const removeWineFromCellar = (id, location) =>
  new Promise((resolve, reject) => {
    var result = null

    const connection = getConnection()
    const request = new Request(`[dbo].[RemoveBottleFromCellar]`, (err) => {
      connection.close()
      if (err) {
        reject(err)
      } else {
        if (result == "" || result == null || result == "null") result = null
        resolve(result)
      }
    })
    request.addParameter("WineId", TYPES.Int, id)
    request.addParameter("Location", TYPES.VarChar, location)

    connection.on("connect", (err) => {
      if (err) {
        reject(err)
      } else {
        connection.callProcedure(request)
      }
    })

    connection.connect()
  })
