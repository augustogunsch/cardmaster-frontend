import React from 'react';
import { useParams } from 'react-router-dom';

import {
  CircularProgress,
  Stack
} from '@mui/material';

import Layout from '../components/Layout/Layout';
import deckService from '../services/deckService';
import { useLoad, useAppSelector } from '../hooks';

const Practice = (): React.JSX.Element => {
  const { deckId } = useParams();
  const user = useAppSelector(store => store.user);

  const [deck] = useLoad(async () => {
    const deck = await deckService.getDeck(Number(deckId), user.token ?? '');
    if (user.self?.username !== deck.data?.user) {
      return null;
    }
    return deck;
  }, deckId !== undefined && user.self != null && user.token != null);

  return (
    <Layout>
      <>
        { deck !== undefined && deck !== null && <p>{deck.name}</p> }
        { deck === undefined && (
          <Stack
            justifyContent="center"
            direction="row"
            alignItems="center"
          >
            <CircularProgress />
          </Stack>
        )}
        { deck === null && <p>Error</p> }
      </>
    </Layout>
  );
};

export default Practice;
