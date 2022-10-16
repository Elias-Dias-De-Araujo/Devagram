import { NextApiRequest, NextApiResponse } from "next";
import type { defaultResponseMsg } from "../../types/defaultResponseMsg";
import type { signUpType } from "../../types/signUpType";
import { userModel } from "../../models/userModel";
import { connectDb } from "../../middlewares/connectDb";
import md5 from "md5";

const endPointSignUp = async (
  req: NextApiRequest,
  res: NextApiResponse<defaultResponseMsg>
) => {
  if (req.method === "POST") {
    const user = req.body as signUpType;

    if (!user.name || user.name.length < 2) {
      return res.status(400).json({ error: "nome inválido" });
    }

    if (
      !user.email ||
      user.email.length < 5 ||
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user.email)
    ) {
      return res.status(400).json({ error: "email inválido" });
    }

    if (!user.password || user.password.length < 8) {
      return res.status(400).json({ error: "senha inválida" });
    }

    const userCript = {
      name: user.name,
      email: user.email,
      password: md5(user.password),
    };

    // verificar duplicidade de usuários
    const userDuplicate = await userModel.find({
      email: userCript.email,
    });

    if (userDuplicate.length > 0) {
      return res.status(400).json({ error: "Email já existente" });
    }

    await userModel.create(userCript);
    return res.status(200).json({ msg: "Usuário criado com sucesso" });
  }

  return res.status(405).json({ error: "Método de solicitação inválido" });
};

export default connectDb(endPointSignUp);
