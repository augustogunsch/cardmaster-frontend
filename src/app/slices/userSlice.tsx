import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/userService'
import { setError } from './messageSlice'
import { AxiosError } from 'axios'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AppDispatch } from '../store'

export type UserState = {
  id: number,
  username: string,
  admin: boolean
  token: string
};

const initialState: UserState = {
  id: 0,
  username: '',
  admin: false,
  token: ''
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserState: (_state, action: PayloadAction<UserState>) => {
      return action.payload
    }
  }
});

export const { setUserState } = userSlice.actions;

export const login = (username: string, password: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      const loginInfo = await userService.login(username, password);

      const state = {...loginInfo.user, token: loginInfo.token};

      localStorage.setItem('user', JSON.stringify(state))
      dispatch(setUserState(state));
    } catch (e) {
      if (e instanceof AxiosError) {
        dispatch(setError(e.response ? e.response.data.message : e.message));
      } else {
        throw e;
      }
    }
  }
}

export const logout = () => {
  return async (dispatch: AppDispatch) => {
    localStorage.removeItem('user')
    dispatch(setUserState(initialState))
  }
}

export const loadUser = () => {
  return async (dispatch: AppDispatch) => {
    const state = localStorage.getItem('user');
    if (state) {
      dispatch(setUserState(JSON.parse(state)));
    }
  }
}

export default userSlice.reducer;
