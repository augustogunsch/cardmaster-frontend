import React from 'react';
import { useParams } from 'react-router-dom';

import {
  CircularProgress,
  Stack
} from '@mui/material';

import Layout from '../components/Layout/Layout';
import { useAppSelector } from '../hooks';
import { selectDecks } from '../slices/decksSlice';

const Practice = (): React.JSX.Element => {
  const { deckId } = useParams();
  const decks = useAppSelector(selectDecks);

  const deck = decks.value?.find(deck => deck.id === Number(deckId));

  return (
    <Layout>
      <>
        { deck != null && <p>{deck.name}</p> }
        { deck == null && (
          <Stack
            justifyContent="center"
            direction="row"
            alignItems="center"
          >
            <CircularProgress />
          </Stack>
        )}
      </>
    </Layout>
  );
};

export default Practice;
