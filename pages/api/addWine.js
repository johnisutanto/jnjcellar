import { insertWine } from "../../utils/connectDb";

export default async function handler(req, res) {
  await insertWine(req.body.data)
  res.send({})
}
