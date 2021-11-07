import { User } from "../models/User";

export const validateUser = (user: User) => {
  validateName(user.name);
  validateEmail(user.email);
  validatePassword(user.password);
}

export const validateName = (name: string) => {
  if (!name || name.length <= 2) {
    throw { code: 405, error: 'Usuário invalido.' };
  }
}

export const validateEmail = (email: string) => {
  if (!email || email.length <= 5) {
    throw { code: 405, error: 'Email invalido.' };
  }
}

export const validatePassword = (password: string) => {
  if (!password || password.length <= 3) {
    throw { code: 405, error: 'Senha invalida.' };
  }
}

export const validateIfEmailExists = (existingUser: any[]) => {
  if (existingUser && existingUser.length > 0) {
    throw { code: 400, error: 'Ja existe usuario com o email informado.' };
  }
}