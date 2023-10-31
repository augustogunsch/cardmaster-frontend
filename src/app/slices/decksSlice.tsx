import { createSlice } from '@reduxjs/toolkit';
import { setSuccess, setGenericError, setError } from './messageSlice';
import deckService from '../services/deckService';
import userService from '../services/userService';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { IDeck } from '../services/deckService';
import type { AppDispatch, AppGetState } from '../store';

export interface IDecksState {
  owned: IDeck[] | null | undefined
};

const initialState: IDecksState = {
  owned: undefined
};

export const decksSlice = createSlice({
  name: 'decks',
  initialState,
  reducers: {
    setDecks: (_state, action: PayloadAction<IDecksState>) => {
      return action.payload;
    },
    appendDeck: (state, action: PayloadAction<IDeck>) => {
      if (state.owned == null) {
        return { owned: [action.payload] };
      }
      state.owned.push(action.payload);
    },
    replaceDeck: (state, action: PayloadAction<IDeck>) => {
      if (state.owned == null) {
        return state;
      }
      return { owned: state.owned.map(deck => deck.id === action.payload.id ? action.payload : deck) };
    },
    removeDeck: (state, action: PayloadAction<IDeck>) => {
      if (state.owned == null) {
        return state;
      }
      return { owned: state.owned.filter(deck => deck.id !== action.payload.id) };
    }
  }
});

export const { setDecks, appendDeck, replaceDeck } = decksSlice.actions;

export const loadDecks = () => {
  return async (dispatch: AppDispatch, getState: AppGetState) => {
    const state = getState();
    if (state.user.self != null && state.user.token != null) {
      const response = await deckService.getUserDecks(state.user.self.id, state.user.token);
      dispatch(setDecks({ owned: response.data }));
    } else {
      dispatch(setDecks(initialState));
    }
  };
};

export const createDeck = (name: string) => {
  return async (dispatch: AppDispatch, getState: AppGetState) => {
    const state = getState();
    if (state.user.token != null) {
      const response = await deckService.postDeck(name, state.user.token);
      dispatch(appendDeck(response.data));
    } else {
      dispatch(setError('You are not logged in'));
    }
  };
};

export const updateDeck = (deck: IDeck) => {
  return async (dispatch: AppDispatch, getState: AppGetState) => {
    const state = getState();
    try {
      if (state.user.token != null) {
        const response = await deckService.updateDeck(deck, state.user.token);
        dispatch(replaceDeck(response.data));
        dispatch(setSuccess('Deck updated successfully'));
      } else {
        dispatch(setError('You are not logged in'));
      }
    } catch (e) {
      void dispatch(setGenericError(e));
    }
  };
};

export const deleteDeck = (deckId: number) => {
  return async (dispatch: AppDispatch, getState: AppGetState) => {
    const state = getState();
    try {
      if (state.user.token != null) {
        const response = await deckService.deleteDeck(deckId, state.user.token);
        dispatch(decksSlice.actions.removeDeck(response.data));
        dispatch(setSuccess('Deck deleted successfully'));
      } else {
        dispatch(setError('You are not logged in'));
      }
    } catch (e) {
      void dispatch(setGenericError(e));
    }
  };
};

export const duplicateDeck = (deckId: number) => {
  return async (dispatch: AppDispatch, getState: AppGetState) => {
    const state = getState();
    try {
      if (state.user.self != null && state.user.token != null) {
        const response = await userService.addDeck(state.user.self.id, deckId, state.user.token);
        dispatch(appendDeck(response.data));
        dispatch(setSuccess('Deck cloned successfully'));
      } else {
        dispatch(setError('You are not logged in'));
      }
    } catch (e) {
      void dispatch(setGenericError(e));
    }
  };
};

export default decksSlice.reducer;
