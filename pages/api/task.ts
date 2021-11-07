import { NextApiRequest, NextApiResponse } from "next";
import { validateTask, validateUserId } from "../../helpers/task-validators";
import { corsPolicy } from "../../middlewares/corsPolicy";
import { dbConnect } from "../../middlewares/dbConnect";
import { jwtValidator } from "../../middlewares/jwtValidator";
import { DefaultReturn } from "../../models/DefaultReturn";
import { GetTasksRequest } from "../../models/GetTasksRequest";
import { Task } from "../../models/Task";
import { TaskModel } from "../../models/TaskModel";
import { TaskRequest } from "../../models/TaskRequest";

const handler = async (req: NextApiRequest, res: NextApiResponse<DefaultReturn | Task[]>) => {
  try {
    let userId = req.body?.userId;
    if (!userId) {
      userId = req.query?.userId as string;
    }

    switch (req.method) {
      case 'POST':
        return await saveTask(req, res, userId);
      case 'PUT':
        return await updateTask(req, res, userId);
      case 'DELETE':
        return await deleteTask(req, res, userId);
      case 'GET':
        return await getTasks(req, res, userId);
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

const saveTask = async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  const task: TaskRequest = req.body;
  validateTask(task);
  validateUserId(userId);

  const taskToSave: Task = buildTaskToSave(userId, task);
  await TaskModel.create(taskToSave);
  res.status(200).json({ message: 'Tarefa criada com sucesso' })
}

const buildTaskToSave = (userId: string, task: TaskRequest) => {
  return {
    userId,
    name: task.name,
    finishPrevisionDate: task.finishPrevisionDate
  }
}

const validateAndReturnTaskFound = async (req: NextApiRequest, userId: string) => {
  const taskId = req.query?.id as string;

  if (!userId && (!taskId || taskId.trim() === '')) {
    return null;
  }

  const taskFound = await TaskModel.findById(taskId);
  return taskFound;
}

const updateTask = async (req: NextApiRequest, res: NextApiResponse<DefaultReturn>, userId: string) => {
  const task: TaskRequest = req.body;

  const taskFound = await validateAndReturnTaskFound(req, userId);
  if (!taskFound) {
    throw { code: 400, error: 'Tarefa nao encontrada' };
  }

  validateTask(task);
  validateUserId(userId);

  taskFound.name = task.name;
  taskFound.finishPrevisionDate = task.finishPrevisionDate;
  taskFound.finishDate = task.finishDate;

  await TaskModel.findByIdAndUpdate({ _id: taskFound._id }, taskFound);
  return res.status(200).json({ message: 'Tarefa alterada com sucesso.' });
}

const deleteTask = async (req: NextApiRequest, res: NextApiResponse<DefaultReturn>, userId: string) => {
  const taskFound = await validateAndReturnTaskFound(req, userId);
  if (!taskFound) {
    throw { code: 400, error: 'Tarefa nao encontrada' };
  }

  await TaskModel.findByIdAndDelete({ _id: taskFound._id });
  return res.status(200).json({ message: 'Tarefa deletada com sucesso.' });
}

const getTasks = async (req: NextApiRequest, res: NextApiResponse<DefaultReturn | Task[]>, userId: string) => {
  const params: GetTasksRequest = req.query;
  validateUserId(userId)
  const query = {
    userId
  } as any

  if (params?.finishPrevisionDateStart) {
    query.finishPrevisionDate = { $gte: params?.finishPrevisionDateStart }
  }

  if (params?.finishPrevisionDateEnd) {
    if (!params?.finishPrevisionDateStart) {
      query.finishPrevisionDate = {}
    }
    query.finishPrevisionDate.$lte = params?.finishPrevisionDateEnd
  }

  if (params?.status) {
    const status = parseInt(params.status);
    if (status === 1) query.finishDate = null
    else if (status === 2) query.finishDate = { $ne: null };
  }

  const result = await TaskModel.find(query) as Task[];
  return res.status(200).json(result);
}

export default corsPolicy(dbConnect(jwtValidator(handler)));