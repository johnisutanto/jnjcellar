import { insertWine } from "../../services/wine";

export default async function handler(req, res) {
  await insertWine(req.body.data)
  res.send({})
}
