import { useState } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from './store'

type Field = {
  value: string,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  type: string,
  error: boolean,
  helperText: string
}

export const useField = (type: string): [Field, (value: string) => void] => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    setError('');
  };

  const setErrorCallback = (value: string) => {
    setError(value)
  }

  const field: Field = {
    value,
    onChange,
    type,
    error: Boolean(error),
    helperText: error
  };

  return [field, setErrorCallback];
};

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
