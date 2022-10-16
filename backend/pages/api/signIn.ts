import { NextApiRequest, NextApiResponse } from "next";
import { connectDb } from "../../middlewares/connectDb";
import { defaultResponseMsg } from "../../types/defaultResponseMsg";
import { signInType } from "../../types/signInType";
import md5 from "md5";
import { userModel } from "../../models/userModel";
import jwt from "jsonwebtoken";

const endPointSignIn = async (
  req: NextApiRequest,
  res: NextApiResponse<defaultResponseMsg | signInType>
) => {
  const { JWT_KEY } = process.env;

  if (!JWT_KEY) {
    return res.status(500).json({ error: "Chave jwt não informada" });
  }

  if (req.method === "POST") {
    const { email, password } = req.body;

    const findUser = await userModel.find({
      email: email,
      password: md5(password),
    });

    if (findUser.length > 0) {
      const userFinded = findUser[0];
      const token = jwt.sign({ _id: userFinded._id }, JWT_KEY);
      return res.status(200).json({
        name: userFinded.name,
        email: userFinded.email,
        token,
      });
    }

    return res.status(405).json({ error: "Usuário não encontrado" });
  }

  return res.status(405).json({ error: "Método de solicitação inválido" });
};

// Primeiro passa pelo middleware de conectar com o Db e depois pelo endpoint de login
export default connectDb(endPointSignIn);
