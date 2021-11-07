import { NextApiRequest } from "next";

export const validatePostRequest = (req: NextApiRequest) => {
  if (req.method !== 'POST' || !req.body) {
    throw { code: 405, error: 'Metodo informado nao esta disponivel.' };
  }
}