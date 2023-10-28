import { useState } from 'react';
import { useAppSelector } from '../hooks'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Layout from '../components/Layout'
import Deck from '../components/Deck'
import DeckCreateForm from '../components/DeckCreateForm'

const Decks = () => {
  const [open, setOpen] = useState(false);
  const decks = useAppSelector(store => store.decks);

  return (
    <Layout>
      <Box>
        <Typography
          variant="h4"
          mb={2}
        >
          My decks
        </Typography>
        <Button
          sx={{ mb: 4 }}
          variant="contained"
          color="secondary"
          onClick={() => setOpen(true)}
        >
          Create Deck
        </Button>
        {decks.map(deck => (
          <Deck deck={deck} key={deck.id} />
        ))}
      </Box>
      <DeckCreateForm open={open} handleClose={() => setOpen(false)}/>
    </Layout>
  );
};

export default Decks;
