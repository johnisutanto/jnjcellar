import { removeWineFromCellar } from "../../services/cellar"
import { getWine } from "../../services/wine"

export default async function handler(req, res) {
  const { id, location, cellarId } = req.body
  await removeWineFromCellar(id, location, cellarId)
  const updatedWine = await getWine(id)
  res.send(updatedWine)
}
