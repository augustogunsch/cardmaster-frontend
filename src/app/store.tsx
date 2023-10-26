import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import messageSlice from './slices/messageSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    message: messageSlice,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
