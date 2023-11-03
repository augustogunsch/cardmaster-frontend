import axios from 'axios';
import { AuthHeader } from './util';

const decksUrl = 'http://localhost:5000/decks';
const usersUrl = 'http://localhost:5000/users';

export interface IDeck {
  id: number
  name: string
  user: string
  shared: boolean
  all_count?: number
  due_count?: number
  new_count?: number
}

export interface IDecksResponse {
  data: IDeck[]
  count?: number
}

export interface IDeckResponse {
  data: IDeck
}

export interface NumberResponse {
  data: number
}

export interface IGetUserDecksParams {
  q?: string
  limit?: number
  offset?: number
  card_count?: string
  due?: string
};

export interface IGetDeckParams {
  card_count?: string
  due?: string
};

export interface IGetDecksParams {
  q?: string
  limit?: number
  offset?: number
  total_count?: boolean
  card_count?: string
  due?: string
};

const getUserDecks = async (userId: number, token: string, params?: IGetUserDecksParams): Promise<IDecksResponse> => {
  const response = await axios.get(
    `${usersUrl}/${userId}/decks`,
    { params, ...AuthHeader(token) }
  );
  return response.data;
};

const getDeck = async (deckId: number, token: string, params?: IGetDeckParams): Promise<IDeckResponse> => {
  const response = await axios.get(
    `${decksUrl}/${deckId}`,
    { params, ...AuthHeader(token) }
  );
  return response.data;
};

const getDecks = async (params?: IGetDecksParams): Promise<IDecksResponse> => {
  const response = await axios.get(
    decksUrl,
    { params }
  );
  return response.data;
};

const postDeck = async (name: string, token: string): Promise<IDeckResponse> => {
  const response = await axios.post(
    decksUrl,
    { name },
    AuthHeader(token)
  );
  return response.data;
};

const updateDeck = async (deck: IDeck, token: string): Promise<IDeckResponse> => {
  const response = await axios.put(
    `${decksUrl}/${deck.id}`,
    deck,
    AuthHeader(token)
  );
  return response.data;
};

const deleteDeck = async (deckId: number, token: string): Promise<IDeckResponse> => {
  const response = await axios.delete(
    `${decksUrl}/${deckId}`,
    AuthHeader(token)
  );
  return response.data;
};

export default {
  getUserDecks,
  getDeck,
  getDecks,
  postDeck,
  updateDeck,
  deleteDeck
};
