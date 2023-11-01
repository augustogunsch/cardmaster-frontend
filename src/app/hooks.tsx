import { useState, useEffect } from 'react';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';

import type { RootState, AppDispatch } from './store';
import { setGenericError } from './slices/messageSlice';
import { LoadWrapper } from './types';

interface InputProps {
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  type: string
  error: boolean
  helperText: string
}

export interface UseField {
  inputProps: InputProps
  value: string
  clear: () => void
  setError: (value: string) => void
  setValue: (value: string) => void
}

type UseRequiredField = UseField & {
  validate: () => boolean
};

export const useField = (type: string): UseField => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
    setError('');
  };

  const clear = (): void => {
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

  const validate = (): boolean => {
    if ((type === 'password' && field.value.length === 0) ||
        (type !== 'password' && field.value.trim().length === 0)) {
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

export const useValidate = (validateFunctions: Array<() => boolean>): () => boolean => () => (
  validateFunctions.reduce((acc, fun) => fun() && acc, true)
);

export const useLoad = <T = any>(
  fetch: () => Promise<{ data: T } | null>,
  condition: boolean
): [
    LoadWrapper<T>,
    (newData: T) => void
  ] => {
  const [data, setData] = useState<LoadWrapper<T>>(LoadWrapper.loading());
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (condition) {
      fetch()
        .then(response => {
          if (response !== null) {
            setData(LoadWrapper.withData(response.data));
          } else {
            setData(LoadWrapper.error());
          }
        }).catch(e => {
          setData(LoadWrapper.error());
          void dispatch(setGenericError(e));
        });
    } else {
      setData(LoadWrapper.loading());
    }
  }, [condition]);

  return [data, (newData: T) => { setData(LoadWrapper.withData(newData)); }];
};

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
