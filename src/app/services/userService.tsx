import axios from 'axios';
import type { IDeck } from './deckService';
import { AuthHeader } from './util';

const usersUrl = 'http://localhost:5000/users';
const authUrl = 'http://localhost:5000/auth';

export interface IUser {
  id: number
  username: string
  admin: boolean
}

export interface ILoginResponse {
  user: IUser
  token: string
}

export interface IRegisterReponse {
  data: IUser
}

export interface IAddReponse {
  data: IDeck
}

const login = async (username: string, password: string): Promise<ILoginResponse> => {
  const response = await axios.post(authUrl, { username, password });
  return response.data;
};

const register = async (username: string, password: string): Promise<IRegisterReponse> => {
  const response = await axios.post(usersUrl, { username, password });
  return response.data;
};

const addDeck = async (userId: number, deckId: number, token: string): Promise<IAddReponse> => {
  const response = await axios.post(
    `${usersUrl}/${userId}/decks/${deckId}`,
    {},
    AuthHeader(token)
  );
  return response.data;
};

export default {
  login,
  register,
  addDeck
};
