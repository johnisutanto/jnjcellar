import { getEmptyShelves } from "../../utils/connectDb";

export default async function handler(req, res) {
  const shelves = await getEmptyShelves()
  res.send(shelves)
}
