import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import NextCors from 'nextjs-cors';
import { DefaultReturn } from '../models/DefaultReturn';

const corsPolicy = (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse<DefaultReturn>) => {

    await NextCors(req, res, {
      methods: ['GET', 'OPTIONS', 'PUT', 'POST', 'DELETE'],
      origin: '*',
      optionsSuccessStatus: 200
    });

    return handler(req, res);
  }

export { corsPolicy }