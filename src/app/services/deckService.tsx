import axios from 'axios';
import { AuthHeader } from './util';

const decksUrl = 'http://localhost:5000/decks';
const usersUrl = 'http://localhost:5000/users';

export interface IDeck {
  id: number
  name: string
  user: string
  cards_count: number
  shared: boolean
}

export interface IDecksResponse {
  data: IDeck[]
}

export interface IDeckResponse {
  data: IDeck
}

export interface NumberResponse {
  data: number
}

export interface IGetDecksParams {
  q?: string
  limit?: number
  offset?: number
};

const getUserDecks = async (userId: number, token: string): Promise<IDecksResponse> => {
  const response = await axios.get(
    `${usersUrl}/${userId}/decks`,
    AuthHeader(token)
  );
  return response.data;
};

const getDeck = async (deckId: number, token: string): Promise<IDeckResponse> => {
  const response = await axios.get(
    `${decksUrl}/${deckId}`,
    AuthHeader(token)
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

const countDecks = async (params?: IGetDecksParams): Promise<NumberResponse> => {
  const response = await axios.get(
    decksUrl,
    { params: { ...params, count: true } }
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
  countDecks,
  postDeck,
  updateDeck,
  deleteDeck
};
