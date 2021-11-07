import { NextApiRequest, NextApiResponse } from "next";
import build from "next/dist/build";
import { validateTask, validateUserId } from "../../helpers/task-validators";
import { dbConnect } from "../../middlewares/dbConnect";
import { DefaultReturn } from "../../models/DefaultReturn";
import { Task } from "../../models/Task";
import { TaskModel } from "../../models/TaskModel";
import { TaskRequest } from "../../models/TaskRequest";

const handler = async (req: NextApiRequest, res: NextApiResponse<DefaultReturn>) => {
  try {
    switch (req.body) {
      case 'POST':
        await saveTask(req, res);
        break;

      default:
        break;
    }


    throw { code: 403, error: 'Parametros de entrada invalido.' };
  } catch (e: any) {
    console.log(e);
    (e.code && e.error)
      ? res.status(e.code).json({ error: e.error })
      : res.status(500).json({ error: 'Ocorreu um erro.' });
  }
}

const saveTask = async (req: NextApiRequest, res: NextApiResponse) => {
  const task: TaskRequest = req.body;
  const userId = req.body?.userId;

  validateTask(task);
  validateUserId(userId);

  const taskToSave: Task = buildTaskToSave(userId, task);
  await TaskModel.create(task);
  res.status(200).json({ message: 'Tarefa criada com sucesso' })
}

const buildTaskToSave = (userId: string, task: TaskRequest) => {
  return {
    userId,
    name: task.name,
    finishPrevisionDate: task.finishPrevisionDate,
    finishDate: task.finishDate
  }
}

export default dbConnect(handler);