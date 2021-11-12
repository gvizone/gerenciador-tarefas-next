import type { NextApiRequest, NextApiResponse } from 'next';
import { UserModel } from '../../models/UserModel';
import md5 from 'md5';
import { dbConnect } from '../../middlewares/dbConnect';
import { DefaultReturn } from '../../models/DefaultReturn';
import { User } from '../../models/User';
import { validatePostRequest } from '../../helpers/request-validators';
import jwt from 'jsonwebtoken';
import { corsPolicy } from '../../middlewares/corsPolicy';

interface LoginRequest {
  login: string,
  password: string
}

interface LoginResponse {
  name: string,
  email: string,
  token: string
}

const handler = async (req: NextApiRequest, res: NextApiResponse<DefaultReturn | LoginResponse>) => {
  try {
    validatePostRequest(req);
    const { MY_SECRET_KEY } = process.env;
    if (!MY_SECRET_KEY) throw { code: 500, error: 'Chave não existente' };
    const obj: LoginRequest = req.body;
    if (obj.login && obj.password) {
      const usersFound = await UserModel.find({ email: obj.login, password: md5(obj.password) });
      if (usersFound && usersFound.length > 0) {
        const user: User = usersFound[0];
        const token = jwt.sign({ _id: user._id }, MY_SECRET_KEY);
        return res.status(200).json({ name: user.name, email: user.email, token });
      }
    }

    throw { code: 403, error: 'Parametros de entrada invalido.' };
  } catch (e: any) {
    console.log(e);
    (e.code && e.error)
      ? res.status(e.code).json({ error: e.error })
      : res.status(500).json({ error: 'Ocorreu um erro.' });
  }
}

export default corsPolicy(dbConnect(handler));
