import { createSlice } from '@reduxjs/toolkit';
import { setSuccess, setGenericError } from './messageSlice';
import deckService from '../services/deckService';
import userService from '../services/userService';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { IDeck } from '../services/deckService';
import type { AppDispatch, AppGetState } from '../store';

const initialState: IDeck[] = [];

export const decksSlice = createSlice({
  name: 'decks',
  initialState,
  reducers: {
    setDecks: (_state, action: PayloadAction<IDeck[]>) => {
      return action.payload;
    },
    appendDeck: (state, action: PayloadAction<IDeck>) => {
      state.push(action.payload);
    },
    replaceDeck: (state, action: PayloadAction<IDeck>) => {
      return state.map(deck => deck.id === action.payload.id ? action.payload : deck);
    },
    removeDeck: (state, action: PayloadAction<IDeck>) => {
      return state.filter(deck => deck.id !== action.payload.id);
    }
  }
});

export const { setDecks, appendDeck, replaceDeck } = decksSlice.actions;

export const loadDecks = () => {
  return async (dispatch: AppDispatch, getState: AppGetState) => {
    const state = getState();
    if (state.user.id !== 0) {
      const response = await deckService.getUserDecks(state.user.id, state.user.token);
      dispatch(setDecks(response.data));
    } else {
      dispatch(setDecks(initialState));
    }
  };
};

export const createDeck = (name: string) => {
  return async (dispatch: AppDispatch, getState: AppGetState) => {
    const state = getState();
    const response = await deckService.postDeck(name, state.user.token);
    dispatch(appendDeck(response.data));
  };
};

export const updateDeck = (deck: IDeck) => {
  return async (dispatch: AppDispatch, getState: AppGetState) => {
    const state = getState();
    try {
      const response = await deckService.updateDeck(deck, state.user.token);
      dispatch(replaceDeck(response.data));
      dispatch(setSuccess('Deck updated successfully'));
    } catch (e) {
      void dispatch(setGenericError(e));
    }
  };
};

export const deleteDeck = (deckId: number) => {
  return async (dispatch: AppDispatch, getState: AppGetState) => {
    const state = getState();
    try {
      const response = await deckService.deleteDeck(deckId, state.user.token);
      dispatch(decksSlice.actions.removeDeck(response.data));
      dispatch(setSuccess('Deck deleted successfully'));
    } catch (e) {
      void dispatch(setGenericError(e));
    }
  };
};

export const duplicateDeck = (deckId: number) => {
  return async (dispatch: AppDispatch, getState: AppGetState) => {
    const state = getState();
    try {
      const response = await userService.addDeck(state.user.id, deckId, state.user.token);
      dispatch(appendDeck(response.data));
      dispatch(setSuccess('Deck cloned successfully'));
    } catch (e) {
      void dispatch(setGenericError(e));
    }
  };
};

export default decksSlice.reducer;
