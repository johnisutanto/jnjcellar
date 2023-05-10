import { updateWine } from "../../utils/connectDb"
import { getWine } from "../../services/wine"

export default async function handler(req, res) {
  console.log(`${JSON.stringify(req.body)}`)
  const id = req.body.id
  const newLocation = req.body.location.join("|")
  await updateWine(id, newLocation)
  const updatedWine = await getWine(id)
  console.log(`returning wine ${JSON.stringify(updatedWine)}`)
  res.send(updatedWine).status(200)
}
