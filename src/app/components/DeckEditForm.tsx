import { useState } from 'react';

import List from '@mui/material/List';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import { useEffect } from 'react';
import { useRequiredField, useAppDispatch, useAppSelector } from '../hooks';
import { updateDeck } from '../slices/decksSlice';
import cardService from '../services/cardService'
import type { Deck } from '../services/deckService'
import type { Card as CardType } from '../services/cardService'

import DynamicForm from './DynamicForm';
import Card from './Card';

type DeckEditFormProps = {
  open: boolean,
  handleClose: () => void,
  deck: Deck
}

const DeckEditForm = ({open, handleClose, deck}: DeckEditFormProps) => {
  const name = useRequiredField('Name', 'text');
  const token = useAppSelector(store => store.user.token);
  const [shared, setShared] = useState(false);
  const [cards, setCards] = useState<CardType[] | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    name.setValue(deck.name);
    setShared(deck.shared);

    if (open) {
      cardService
        .getCards(deck.id, token)
        .then(response => {
          setCards(response.data);
        });
    } else {
      setCards(null);
    }
  }, [open]);

  const handleSubmit = () => {
    if (name.validate()) {
      handleClose();

      const updatedDeck = {
        ...deck,
        name: name.value,
        shared: shared
      };

      dispatch(updateDeck(updatedDeck));
      name.clear();
    }
  };

  const updateCard = (updatedCard: CardType) => {
    if (cards !== null) {
      setCards(cards.map(card => card.id === updatedCard.id ? updatedCard : card));
    }
  };

  return (
    <DynamicForm
      title="Edit deck"
      handleSubmit={handleSubmit}
      handleClose={handleClose}
      open={open}
    >
      <Grid container gap={2}>
        <Grid item xs={12} >
          <TextField
            required
            fullWidth
            label="Name"
            variant="outlined"
            {...name.inputProps}
          />
        </Grid>
        <Grid item xs={12} >
          <FormControlLabel label="Shared" control={(
              <Switch
                aria-label="Name"
                inputProps={{ 'aria-label': 'controlled' }}
                checked={shared}
                onChange={() => setShared(!shared)}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} >
          <List>
            {cards !== null && cards.map(card => (
              <Card key={card.id} card={card} updateCard={updateCard} />
            ))}
          </List>
        </Grid>
      </Grid>
    </DynamicForm>
  );
};

export default DeckEditForm;
