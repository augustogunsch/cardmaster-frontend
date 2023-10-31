import React from 'react';
import { useAppSelector } from '../hooks';
import Login from '../pages/Login';

export interface IProps {
  children: React.JSX.Element | React.JSX.Element[]
}

const LoggedIn = ({ children }: IProps): React.JSX.Element => {
  const user = useAppSelector(store => store.user);

  if (user.id !== 0) {
    return <>{children}</>;
  }

  return <Login />;
};

export default LoggedIn;
