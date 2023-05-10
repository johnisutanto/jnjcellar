import { getWine, updateWine } from "../../services/wine"

export default async function handler(req, res) {
  const id = req.body.id
  const wine = req.body.wine
  await updateWine(id, wine)
  const updatedWine = await getWine(id)
  res.send(updatedWine)
}
