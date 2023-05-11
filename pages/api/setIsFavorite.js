import { getWine, setIsFavorite } from "../../services/wine"

export default async function handler(req, res) {
  const { id, isFavorite } = req.body
  await setIsFavorite(id, isFavorite)
  const updatedWine = await getWine(id)
  res.send(updatedWine)
}
