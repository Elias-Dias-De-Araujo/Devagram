import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import type { defaultResponseMsg } from "../types/defaultResponseMsg";
import jwt, { JwtPayload } from "jsonwebtoken";

export const validateTokenJwt =
  (handler: NextApiHandler) =>
  (req: NextApiRequest, res: NextApiResponse<defaultResponseMsg>) => {
    try {
      const { JWT_KEY } = process.env;

      if (!JWT_KEY) {
        return res.status(500).json({ error: "Chave jwt não informada" });
      }

      if (!req || !req.headers) {
        return res.status(401).json({ error: "token de acesso não validado" });
      }

      if (req.method !== "OPTIONS") {
        const authorization = req.headers["authorization"];
        if (!authorization) {
          return res
            .status(401)
            .json({ error: "token de acesso não validado" });
        }

        // os espaços contando desde "Bearer "
        const token = authorization.substring(7);
        if (!token) {
          return res
            .status(401)
            .json({ error: "token de acesso não validado" });
        }

        const decoded = jwt.verify(token, JWT_KEY) as JwtPayload;

        if (!decoded) {
          return res
            .status(401)
            .json({ error: "token de acesso não validado" });
        }

        if (!req.query) {
          req.query = {};
        }

        req.query.userId = decoded._id;
      }
    } catch (e) {
      console.log(e);
      return res.status(401).json({ error: "token de acesso não validado" });
    }
    return handler(req, res);
  };
