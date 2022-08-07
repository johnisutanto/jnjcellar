import { getWineFilters } from "../../utils/connectDb";

export default async function handler(req, res) {
  const filters = await getWineFilters()
  res.send(filters)
}
