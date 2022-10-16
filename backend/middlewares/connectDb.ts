import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import mongoose from "mongoose";
import { defaultResponseMsg } from "../types/defaultResponseMsg";

export const connectDb =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse<defaultResponseMsg>) => {
    // verificar se a conexão com o banco e seguir para endpoint ou próximo middleware
    if (mongoose.connections[0].readyState) {
      return handler(req, res);
    }

    // senão estiver, então obtém variável de ambiente do env
    const { DB_CONNECT_STRING } = process.env;

    if (!DB_CONNECT_STRING) {
      return res
        .status(500)
        .json({ error: "env de configuração não informado" });
    }

    mongoose.connection.on("connected", () =>
      console.log("Conexão estabelecida com o DB")
    );
    mongoose.connection.on("error", (error) =>
      console.log(`Ocorreu um erro ao se conectar no DB :${error}`)
    );
    await mongoose.connect(DB_CONNECT_STRING);

    // agora pode-se seguir para o endpoint
    return handler(req, res);
  };
