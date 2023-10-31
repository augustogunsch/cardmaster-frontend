import axios from 'axios';
import { AuthHeader } from './util';

const decksUrl = 'http://localhost:5000/decks';
const cardsUrl = 'http://localhost:5000/cards';

export interface ICard {
  front: string
  back: string
};

export type Card = ICard & {
  id: number
  knowledge_level: number
  last_revised: Date | null
  revision_due: Date | null
};

export interface ICardsResponse {
  data: Card[]
};

export interface ICardResponse {
  data: Card
};

export interface INumberResponse {
  data: number
};

export interface IGetCardsParams {
  q?: string
  limit?: number
  offset?: number
  new?: boolean
  due?: string
};

const getCards = async (deckId: number, token: string, params?: IGetCardsParams): Promise<ICardsResponse> => {
  const response = await axios.get(
    `${decksUrl}/${deckId}/cards`,
    { ...AuthHeader(token), params }
  );
  return response.data;
};

const countCards = async (deckId: number, token: string, params?: IGetCardsParams): Promise<INumberResponse> => {
  const response = await axios.get(
    `${decksUrl}/${deckId}/cards`,
    { ...AuthHeader(token), params: { ...params, count: true } }
  );
  return response.data;
};

const createCard = async (card: ICard, deckId: number, token: string): Promise<ICardResponse> => {
  const response = await axios.post(
    `${decksUrl}/${deckId}/cards`,
    card,
    AuthHeader(token)
  );
  return response.data;
};

const updateCard = async (card: Card, token: string): Promise<ICardResponse> => {
  const response = await axios.put(
    `${cardsUrl}/${card.id}`,
    card,
    AuthHeader(token)
  );
  return response.data;
};

const deleteCard = async (cardId: number, token: string): Promise<ICardResponse> => {
  const response = await axios.delete(
    `${cardsUrl}/${cardId}`,
    AuthHeader(token)
  );
  return response.data;
};

export default {
  getCards,
  countCards,
  createCard,
  updateCard,
  deleteCard
};
