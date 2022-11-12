import { getEmptyShelves } from "../../services/cellar";

export default async function handler(req, res) {
  const shelves = await getEmptyShelves()
  res.send(shelves)
}
