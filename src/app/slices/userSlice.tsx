import { createSlice } from '@reduxjs/toolkit';
import userService from '../services/userService';
import { setGenericError } from './messageSlice';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppDispatch } from '../store';

export interface UserState {
  id: number
  username: string
  admin: boolean
  token: string
  loaded: boolean
}

const initialState: UserState = {
  id: 0,
  username: '',
  admin: false,
  token: '',
  loaded: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserState: (_state, action: PayloadAction<UserState>) => {
      return action.payload;
    }
  }
});

export const { setUserState } = userSlice.actions;

export const login = (username: string, password: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      const loginInfo = await userService.login(username, password);

      const state = { ...loginInfo.user, token: loginInfo.token, loaded: true };

      localStorage.setItem('user', JSON.stringify(state));
      dispatch(setUserState(state));
    } catch (e) {
      void dispatch(setGenericError(e));
    }
  };
};

export const logout = () => {
  return async (dispatch: AppDispatch) => {
    localStorage.removeItem('user');
    dispatch(setUserState(initialState));
  };
};

export const loadUser = () => {
  return async (dispatch: AppDispatch) => {
    const state = localStorage.getItem('user');
    if (state !== null) {
      dispatch(setUserState({ ...JSON.parse(state), loaded: true }));
    }
  };
};

export default userSlice.reducer;
