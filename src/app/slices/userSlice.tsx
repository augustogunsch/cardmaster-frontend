import { createSlice } from '@reduxjs/toolkit';
import userService from '../services/userService';
import { setGenericError } from './messageSlice';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppDispatch } from '../store';
import type { IUser } from '../services/userService';
import { LoadWrapper, PlainLoadWrapper } from '../types';
import type { ILoadWrapper } from '../types';

export interface IUserState extends IUser {
  token: string
}

const initialState: ILoadWrapper<IUserState> = PlainLoadWrapper.loading();

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserState: (_state, action: PayloadAction<LoadWrapper<IUserState> | ILoadWrapper<IUserState>>) => {
      if (action.payload instanceof LoadWrapper) {
        return action.payload.toObj();
      }

      return action.payload;
    }
  }
});

export const { setUserState } = userSlice.actions;

export const login = (username: string, password: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      const loginInfo = await userService.login(username, password);

      const state = { ...loginInfo.user, token: loginInfo.token };

      localStorage.setItem('userState', JSON.stringify(state));
      dispatch(setUserState(LoadWrapper.withData(state)));
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
      dispatch(setUserState(LoadWrapper.withData(JSON.parse(state))));
    } else {
      dispatch(setUserState(initialState));
    }
  };
};

export const selectUser = (state: any): LoadWrapper<IUserState> =>
  LoadWrapper.fromObj(state.user as ILoadWrapper<IUserState>);

export default userSlice.reducer;
