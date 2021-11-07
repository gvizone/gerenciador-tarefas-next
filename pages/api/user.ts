import md5 from "md5";
import { NextApiRequest, NextApiResponse } from "next";
import { validatePostRequest } from "../../helpers/request-validators";
import { validateIfEmailExists, validateUser } from "../../helpers/user-validators";
import { corsPolicy } from "../../middlewares/corsPolicy";
import { dbConnect } from "../../middlewares/dbConnect";
import { DefaultReturn } from "../../models/DefaultReturn";
import { User } from "../../models/User";
import { UserModel } from "../../models/UserModel";

const handler = async (req: NextApiRequest, res: NextApiResponse<DefaultReturn>) => {
  try {
    validatePostRequest(req);
    const user: User = req.body;
    validateUser(user);

    const existingUser = await UserModel.find({ email: user.email });
    validateIfEmailExists(existingUser);

    user.password = md5(user.password);
    await UserModel.create(user);
    res.status(200).json({ message: 'Usuario criado com sucesso.' });
  } catch (e: any) {
    console.log(e);
    (e.code && e.error)
      ? res.status(e.code).json({ error: e.error })
      : res.status(500).json({ error: 'Ocorreu um erro.' });
  }
}

export default corsPolicy(dbConnect(handler));