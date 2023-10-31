import axios from 'axios';

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

const getUserDecks = async (userId: number, token: string): Promise<IDecksResponse> => {
  const response = await axios.get(
    `${usersUrl}/${userId}/decks`,
    { headers: { Authorization: token } }
  );
  return response.data;
};

const getDecks = async (filter: string, limit: number, offset: number): Promise<IDecksResponse> => {
  const response = await axios.get(
    decksUrl,
    {
      params: {
        q: filter,
        limit,
        offset
      }
    }
  );
  return response.data;
};

const getDecksCount = async (filter: string): Promise<NumberResponse> => {
  const response = await axios.get(
    decksUrl,
    {
      params: {
        q: filter,
        count: true
      }
    }
  );
  return response.data;
};

const postDeck = async (name: string, token: string): Promise<IDeckResponse> => {
  const response = await axios.post(
    decksUrl,
    { name },
    { headers: { Authorization: token } }
  );
  return response.data;
};

const updateDeck = async (deck: IDeck, token: string): Promise<IDeckResponse> => {
  const response = await axios.put(
    `${decksUrl}/${deck.id}`,
    deck,
    { headers: { Authorization: token } }
  );
  return response.data;
};

const deleteDeck = async (deckId: number, token: string): Promise<IDeckResponse> => {
  const response = await axios.delete(
    `${decksUrl}/${deckId}`,
    { headers: { Authorization: token } }
  );
  return response.data;
};

export default {
  getUserDecks,
  getDecks,
  getDecksCount,
  postDeck,
  updateDeck,
  deleteDeck
};
