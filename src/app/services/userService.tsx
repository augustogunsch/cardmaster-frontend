import axios from 'axios';
import { Deck } from './deckService';

const usersUrl = 'http://localhost:5000/users';
const authUrl = 'http://localhost:5000/auth';

export type User = {
  id: number,
  username: string,
  admin: boolean
}

export interface LoginResponse {
  user: User,
  token: string
}

export interface RegisterReponse {
  data: User,
}

export interface AddReponse {
  data: Deck,
}

const login = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await axios.post(authUrl, { username, password });
  return response.data;
};

const register = async (username: string, password: string): Promise<RegisterReponse> => {
  const response = await axios.post(usersUrl, { username, password });
  return response.data;
};

const addDeck = async (userId: number, deckId: number, token: string): Promise<AddReponse> => {
  const response = await axios.post(
    `${usersUrl}/${userId}/decks/${deckId}`,
    {},
    {headers: {'Authorization': token}}
  );
  return response.data;
};

export default {
  login,
  register,
  addDeck
};
