import axios from 'axios'

const decksUrl = 'http://localhost:5000/decks';
const cardsUrl = 'http://localhost:5000/cards';

export type Card = {
  id: number,
  front: string,
  back: string
}

export type NewCard = {
  front: string,
  back: string
}

type CardsResponse = {
  data: Card[]
}

type CardResponse = {
  data: Card
}

const getCards = async (deckId: number, token: string): Promise<CardsResponse> => {
  const response = await axios.get(
    `${decksUrl}/${deckId}/cards`,
    {headers: {'Authorization': token}}
  );
  return response.data;
}

const createCard = async (card: NewCard, deckId: number, token: string): Promise<CardResponse> => {
  const response = await axios.post(
    `${decksUrl}/${deckId}/cards`,
    card,
    {headers: {'Authorization': token}}
  );
  return response.data;
};

const updateCard = async (card: Card, token: string): Promise<CardResponse> => {
  const response = await axios.put(
    `${cardsUrl}/${card.id}`,
    card,
    {headers: {'Authorization': token}}
  );
  return response.data;
};

const deleteCard = async (cardId: number, token: string): Promise<CardResponse> => {
  const response = await axios.delete(
    `${cardsUrl}/${cardId}`,
    {headers: {'Authorization': token}}
  );
  return response.data;
};

export default {
  getCards,
  createCard,
  updateCard,
  deleteCard
}
