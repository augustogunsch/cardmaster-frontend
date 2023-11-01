export interface ILoadWrapper<T> {
  value: T | null
  isError: boolean
  isLoading: boolean
  isSuccess: boolean
}

export class LoadWrapper<T> {
  readonly value: T | null;
  readonly #error: boolean;

  constructor (value: T | null, error: boolean) {
    if (value !== null && error) {
      throw new Error('Invalid parameters: value and error are mutually exclusive');
    }

    this.value = value;
    this.#error = error;
  }

  isError (): this is { value: null } {
    return this.#error;
  }

  isLoading (): this is { value: null } {
    return !this.#error && this.value === null;
  }

  isSuccess (): this is { value: T } {
    return this.value !== null;
  }

  toObj (): ILoadWrapper<T> {
    return {
      value: this.value,
      isError: this.isError(),
      isLoading: this.isLoading(),
      isSuccess: this.isSuccess()
    };
  }

  static fromObj <U>(obj: ILoadWrapper<U>): LoadWrapper<U> {
    return new LoadWrapper<U>(obj.value, obj.isError);
  }

  static error <U>(): LoadWrapper<U> {
    return new LoadWrapper<U>(null, true);
  }

  static loading <U>(): LoadWrapper<U> {
    return new LoadWrapper<U>(null, false);
  }

  static withData <U>(value: U): LoadWrapper<U> {
    return new LoadWrapper<U>(value, false);
  }
}

export const PlainLoadWrapper = {
  error <T>(): ILoadWrapper<T> {
    return LoadWrapper.error<T>().toObj();
  },

  loading <T>(): ILoadWrapper<T> {
    return LoadWrapper.loading<T>().toObj();
  },

  withData <T>(value: T): ILoadWrapper<T> {
    return LoadWrapper.withData<T>(value).toObj();
  }
};
