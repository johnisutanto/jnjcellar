import { getDbConfig } from "./dbUtil"
import { Connection, Request, TYPES } from "tedious"

const getConnection = () => {
  let connection = null
  if (!connection) {
    connection = new Connection(getDbConfig())
  }
  return connection
}

export const updateWine = (id, value) =>
  new Promise((resolve, reject) => {
    var result = null

    const connection = getConnection()
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
