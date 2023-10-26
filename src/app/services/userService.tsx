import axios from 'axios'

const baseUrl = 'http://localhost:5000/users';
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

const login = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await axios.post(authUrl, { username, password });
  return response.data;
}

const register = async (username: string, password: string): Promise<RegisterReponse> => {
  const response = await axios.post(baseUrl, { username, password });
  return response.data;
}

export default {
  login,
  register
}
