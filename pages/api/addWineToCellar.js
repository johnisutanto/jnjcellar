import { addWineToCellar, getWine } from "../../utils/connectDb";

export default async function handler(req, res) {
  const { id, locations } = req.body
  await addWineToCellar(id, locations)
  const updatedWine = await getWine(id)
  res.send(updatedWine)
}
