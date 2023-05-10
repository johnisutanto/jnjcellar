import { getWineFilters } from "../../services/wine"

export default async function handler(req, res) {
  const filters = await getWineFilters()
  res.send(filters)
}
