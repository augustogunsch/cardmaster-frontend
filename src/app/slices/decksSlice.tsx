import { createSlice } from '@reduxjs/toolkit';
import { setSuccess, setGenericError, setError } from './messageSlice';
import deckService from '../services/deckService';
import userService from '../services/userService';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { IDeck } from '../services/deckService';
import type { AppDispatch, AppGetState } from '../store';
import { PlainLoadWrapper, LoadWrapper } from '../types';
import type { ILoadWrapper } from '../types';

const initialState: ILoadWrapper<IDeck[]> = PlainLoadWrapper.loading();

export const decksSlice = createSlice({
  name: 'decks',
  initialState,
  reducers: {
    setDecks: (_state, action: PayloadAction<ILoadWrapper<IDeck[]> | LoadWrapper<IDeck[]>>) => {
      if (action.payload instanceof LoadWrapper) {
        return action.payload.toObj();
      }

      return action.payload;
    },
    appendDeck: (state, action: PayloadAction<IDeck>) => {
      if (state.value === null) {
        return PlainLoadWrapper.withData([action.payload]);
      }
      state.value.push(action.payload);
    },
    replaceDeck: (state, action: PayloadAction<IDeck>) => {
      if (state.value === null) {
        return state;
      }
      return PlainLoadWrapper.withData(state.value.map(deck => deck.id === action.payload.id ? action.payload : deck));
    },
    removeDeck: (state, action: PayloadAction<IDeck>) => {
      if (state.value === null) {
        return state;
      }
      return PlainLoadWrapper.withData(state.value.filter(deck => deck.id !== action.payload.id));
    }
  }
});

export const { setDecks, appendDeck, replaceDeck } = decksSlice.actions;

export const loadDecks = () => {
  return async (dispatch: AppDispatch, getState: AppGetState) => {
    const state = getState();
    if (state.user.value !== null) {
      const response = await deckService.getUserDecks(state.user.value.id, state.user.value.token);
      dispatch(setDecks(LoadWrapper.withData(response.data)));
    } else {
      dispatch(setDecks(initialState));
    }
  };
};

export const createDeck = (name: string) => {
  return async (dispatch: AppDispatch, getState: AppGetState) => {
    const state = getState();
    if (state.user.value !== null) {
      const response = await deckService.postDeck(name, state.user.value.token);
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
      if (state.user.value !== null) {
        const response = await deckService.updateDeck(deck, state.user.value.token);
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
      if (state.user.value !== null) {
        const response = await deckService.deleteDeck(deckId, state.user.value.token);
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
      if (state.user.value !== null) {
        const response = await userService.addDeck(state.user.value.id, deckId, state.user.value.token);
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

export const selectDecks = (state: any): LoadWrapper<IDeck[]> =>
  LoadWrapper.fromObj(state.decks as ILoadWrapper<IDeck[]>);

export default decksSlice.reducer;
