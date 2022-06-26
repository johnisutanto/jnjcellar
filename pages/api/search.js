import { getWines } from "../../utils/connectDb";

export default async function handler(req, res) {
  console.log(`${JSON.stringify(req.body)}`);
  const queries = req.body
  const wines = await getWines(queries)
  res.send(wines)
}
