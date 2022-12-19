import { addWineToCellar } from "../../services/cellar";
import { getWine } from "../../services/wine";

export default async function handler(req, res) {
  const { id, locations, cellarId } = req.body
  await addWineToCellar(id, locations, cellarId)
  const updatedWine = await getWine(id)
  res.send(updatedWine)
}
