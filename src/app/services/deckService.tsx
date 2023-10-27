import axios from 'axios'

const baseUrl = 'http://localhost:5000/decks';
const usersUrl = 'http://localhost:5000/users';

export type Deck = {
  id: number,
  name: string,
  user: string,
  author: string,
  cards_count: number,
  shared: boolean
}

export interface DecksResponse {
  data: Deck[]
}

export interface DeckResponse {
  data: Deck
}

const getUserDecks = async (userId: number, token: string): Promise<DecksResponse> => {
  const response = await axios.get(
    `${usersUrl}/${userId}/decks`,
    {headers: {'Authorization': token}}
  );
  return response.data;
}

const postDeck = async (name: string, token: string): Promise<DeckResponse> => {
  const response = await axios.post(
    baseUrl,
    {name},
    {headers: {'Authorization': token}}
  );
  return response.data;
}

const updateDeck = async (deck: Deck, token: string): Promise<DeckResponse> => {
  const response = await axios.put(
    `${baseUrl}/${deck.id}`,
    deck,
    {headers: {'Authorization': token}}
  );
  return response.data;
}

export default {
  getUserDecks,
  postDeck,
  updateDeck
}
