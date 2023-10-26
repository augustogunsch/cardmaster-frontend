import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type MessageState = {
  content: string,
  open: boolean,
  autoHideDuration: number,
  severity: 'info' | 'error' | 'warning' | 'success'
};

const initialState: MessageState = {
  content: '',
  open: false,
  autoHideDuration: 6000,
  severity: 'info'
};

export const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setInfo: (_state, action: PayloadAction<string>) => {
      return {
        content: action.payload,
        open: true,
        autoHideDuration: 6000,
        severity: 'info'
      }
    },
    setError: (_state, action: PayloadAction<string>) => {
      return {
        content: action.payload,
        open: true,
        autoHideDuration: 6000,
        severity: 'error'
      }
    },
    setWarning: (_state, action: PayloadAction<string>) => {
      return {
        content: action.payload,
        open: true,
        autoHideDuration: 6000,
        severity: 'warning'
      }
    },
    setSuccess: (_state, action: PayloadAction<string>) => {
      return {
        content: action.payload,
        open: true,
        autoHideDuration: 6000,
        severity: 'success'
      }
    },
    closeMessage: (state) => {
      state.open = false;
    }
  }
});

export const { setInfo, setError, setWarning, setSuccess, closeMessage } = messageSlice.actions;
export default messageSlice.reducer;
