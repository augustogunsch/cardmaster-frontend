import { createSlice } from '@reduxjs/toolkit';
import userService from '../services/userService';
import { setGenericError } from './messageSlice';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppDispatch } from '../store';
import type { IUser } from '../services/userService';

export interface IUserState {
  self: IUser | null | undefined
  token: string | null | undefined
}

const initialState: IUserState = {
  self: undefined,
  token: undefined
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserState: (_state, action: PayloadAction<IUserState>) => {
      return action.payload;
    }
  }
});

export const { setUserState } = userSlice.actions;

export const login = (username: string, password: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      const loginInfo = await userService.login(username, password);

      const state = { self: loginInfo.user, token: loginInfo.token };

      localStorage.setItem('userState', JSON.stringify(state));
      dispatch(setUserState(state));
    } catch (e) {
      void dispatch(setGenericError(e));
    }
  };
};

export const logout = () => {
  return async (dispatch: AppDispatch) => {
    localStorage.removeItem('userState');
    dispatch(setUserState(initialState));
  };
};

export const loadUser = () => {
  return async (dispatch: AppDispatch) => {
    const state = localStorage.getItem('userState');
    if (state !== null) {
      dispatch(setUserState({ ...JSON.parse(state) }));
    } else {
      dispatch(setUserState({ self: null, token: null }));
    }
  };
};

export default userSlice.reducer;
