import { Task } from "../models/Task";
import { TaskRequest } from "../models/TaskRequest";

export const validateTask = (task: TaskRequest) => {
  validateName(task.name);
  validateFinishPrevisionDate(task.finishPrevisionDate);
}

export const validateName = (name: string) => {
  if (!name || name.length <= 2) {
    throw { code: 403, error: 'Nome da tarefa invalida.' };
  }
}

export const validateUserId = (userId: string) => {
  if (!userId) {
    throw { code: 403, error: 'Usuario não encontrado.' };
  }
}

export const validateFinishPrevisionDate = (finishPrevisionDate: Date) => {
  if (!finishPrevisionDate) {
    throw { code: 403, error: 'Campo finishPrevisionDate é obrigatorio.' };
  }
}