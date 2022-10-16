import { NextApiRequest, NextApiResponse } from "next";
import { connectDb } from "../../middlewares/connectDb";
import { defaultResponseMsg } from "../../types/defaultResponseMsg";

const endPointLogin = (
  req: NextApiRequest,
  res: NextApiResponse<defaultResponseMsg>
) => {
  if (req.method === "POST") {
    const { login, password } = req.body;
  }

  return res.status(405).json({ error: "Método de solicitação inválido" });
};

// Primeiro passa pelo middleware de conectar com o Db e depois pelo endpoint de login
export default connectDb(endPointLogin);
