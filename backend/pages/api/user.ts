import { NextApiRequest, NextApiResponse } from "next";
import { validateTokenJwt } from "../../middlewares/validateTokenJwt";

const endPointUser = (req: NextApiRequest, res: NextApiResponse) => {
  return res.status(200).json({ msg: "Usuário autenticado" });
};

export default validateTokenJwt(endPointUser);
