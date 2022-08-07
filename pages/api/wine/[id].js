import { getWine } from "../../../utils/connectDb";

export default async function handler(req, res) {
  const { id } = req.query
  const wine = await getWine(id)
  res.send(wine)
}
