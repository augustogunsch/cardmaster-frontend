import React, { useEffect } from 'react';
import {
  Routes,
  Route
} from 'react-router-dom';

import CssBaseline from '@mui/material/CssBaseline';

import { loadUser } from './slices/userSlice';
import { loadDecks } from './slices/decksSlice';
import { useAppDispatch, useAppSelector } from './hooks';

import Message from './components/Layout/Message';

import Login from './pages/Login';
import Logout from './pages/Logout';
import Home from './pages/Home';
import Decks from './pages/Decks';
import Community from './pages/Community';

const LoggedIn = ({ children }: { children: React.JSX.Element | React.JSX.Element[] }): React.JSX.Element => {
  const user = useAppSelector(store => store.user);

  if (user.id !== 0) {
    return <>{children}</>;
  }

  return <Login />;
};

const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(store => store.user);

  useEffect(() => {
    void dispatch(loadUser());
  }, []);

  useEffect(() => {
    void dispatch(loadDecks());
  }, [user]);

  return (
    <>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<Login />}/>
        <Route path="/logout" element={<Logout />}/>
        <Route path="/decks" element={<LoggedIn><Decks /></LoggedIn>}/>
        <Route path="/community" element={<Community />}/>
        <Route path="/" element={<Home />}/>
      </Routes>
      <Message />
    </>
  );
};

export default App;
