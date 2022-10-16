import { NextApiRequest, NextApiResponse } from "next";
import { connectDb } from "../../middlewares/connectDb";
import { defaultResponseMsg } from "../../types/defaultResponseMsg";
import md5 from "md5";
import { userModel } from "../../models/userModel";

const endPointSignIn = async (
  req: NextApiRequest,
  res: NextApiResponse<defaultResponseMsg>
) => {
  if (req.method === "POST") {
    const { email, password } = req.body;

    const findUser = await userModel.find({
      email: email,
      password: md5(password),
    });

    if (findUser.length > 0) {
      return res.status(200).json({ msg: "Usuário logado" });
    }

    return res.status(405).json({ error: "Usuário não encontrado" });
  }

  return res.status(405).json({ error: "Método de solicitação inválido" });
};

// Primeiro passa pelo middleware de conectar com o Db e depois pelo endpoint de login
export default connectDb(endPointSignIn);
