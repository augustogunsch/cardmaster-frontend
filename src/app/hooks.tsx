import { useState, useEffect } from 'react';
import type { DependencyList, Dispatch, SetStateAction } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { RootState, AppDispatch } from './store';
import { setGenericError } from './slices/messageSlice';

type InputProps = {
  value: string,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  type: string,
  error: boolean,
  helperText: string
};

export type UseField = {
  inputProps: InputProps,
  value: string,
  clear: () => void,
  setError: (value: string) => void,
  setValue: (value: string) => void
};

type UseRequiredField = UseField & {
  validate: () => boolean
};

export const useField = (type: string): UseField => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    setError('');
  };

  const clear = () => {
    setValue('');
    setError('');
  };

  const inputProps: InputProps = {
    value,
    onChange,
    type,
    error: Boolean(error),
    helperText: error
  };

  return {
    inputProps,
    value,
    clear,
    setError,
    setValue
  };
};

export const useRequiredField = (name: string, type: string): UseRequiredField => {
  const field = useField(type);

  const validate = () => {
    if((type === 'password' && !field.value) || (type !== 'password' && !field.value.trim())) {
      field.setError(`${name} is required`);
      return false;
    }

    return true;
  };

  return {
    ...field,
    validate
  };
};

export const useValidate = (validateFunctions: (() => boolean)[]): () => boolean => () => (
  validateFunctions.reduce((acc, fun) => fun() && acc, true)
);

export const useLoad = <T = any>(
  fetch: () => Promise<{data: T}>,
  deps: DependencyList | undefined,
  condition: boolean
): [
  T | null,
  Dispatch<SetStateAction<T | null>>
] => {
  const [elements, setElements] = useState<T | null>(null);
  const dispatch = useAppDispatch();

  const create = () => {
    if (condition) {
      try {
        fetch().then(response => setElements(response.data));
      } catch (e) {
        dispatch(setGenericError(e));
      }
    } else {
      setElements(null);
    }
  };

  useEffect(create, deps);

  return [elements, setElements];
};

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
