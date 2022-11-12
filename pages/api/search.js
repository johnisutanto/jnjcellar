import { getWines } from "../../services/wine";

export default async function handler(req, res) {
  const queries = req.query
  const wines = await getWines(queries)
  res.send(wines)
}
