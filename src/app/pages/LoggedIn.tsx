import React from 'react';
import { useAppSelector } from '../hooks';
import { selectUser } from '../slices/userSlice';
import Login from '../pages/Login';

export interface IProps {
  children: React.JSX.Element | React.JSX.Element[]
}

const LoggedIn = ({ children }: IProps): React.JSX.Element => {
  const user = useAppSelector(selectUser);

  if (user.isLoading()) {
    return <></>;
  }

  if (user.isSuccess()) {
    return <>{children}</>;
  }

  return <Login />;
};

export default LoggedIn;
