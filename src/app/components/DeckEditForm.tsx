import { useState } from 'react';

import List from '@mui/material/List';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';

import { useEffect } from 'react';
import {
  useRequiredField,
  useAppDispatch,
  useAppSelector,
  useField
} from '../hooks';
import { updateDeck, replaceDeck } from '../slices/decksSlice';
import cardService from '../services/cardService'
import type { Deck } from '../services/deckService'
import type { Card as CardType } from '../services/cardService'
import { setSuccess, setGenericError } from '../slices/messageSlice';

import DynamicForm from './DynamicForm';
import Card from './Card';
import Search from './Search';

type DeckEditFormProps = {
  open: boolean,
  handleClose: () => void,
  deck: Deck
}

const DeckEditForm = ({open, handleClose, deck}: DeckEditFormProps) => {
  const dispatch = useAppDispatch();
  const name = useRequiredField('Name', 'text');
  const searchFilter = useField('text');
  const token = useAppSelector(store => store.user.token);
  const [deletingCards, setDeletingCards] = useState(false);
  const [shared, setShared] = useState(false);
  const [cards, setCards] = useState<CardType[] | null>(null);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [showNewCard, setShowNewCard] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (cards !== null && deck.cards_count != cards.length) {
      const updatedDeck = {
        ...deck,
        cards_count: cards.length
      };

      dispatch(replaceDeck(updatedDeck));
    }
  }, [cards]);

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
      setShowNewCard(false);
      setSelectedCards([]);
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

  const updateCard = (updatedCard?: CardType) => {
    if (cards !== null && updatedCard) {
      setCards(cards.map(card => card.id === updatedCard.id ? updatedCard : card));
      dispatch(setSuccess('Card updated succesfully'));
    }
  };

  const appendCard = (newCard?: CardType) => {
    if (cards !== null && newCard) {
      setCards(cards.concat(newCard));
      dispatch(setSuccess('Card created succesfully'));
    }
    setShowNewCard(false);
  };

  const toggleSelected = (id: number) => {
    if (selectedCards.includes(id)) {
      setSelectedCards(selectedCards.filter(n => n !== id))
    } else {
      setSelectedCards(selectedCards.concat(id))
    }
  }

  const deleteCards = () => {
    setDeletingCards(true);

    try {
      selectedCards.forEach(id => {
        cardService.deleteCard(id, token);
      });
      if (cards) {
        setCards(cards.filter(card => !selectedCards.includes(card.id)));
      }
      setSelectedCards([]);
      dispatch(setSuccess('Cards deleted succesfully'));
    } catch (e) {
      dispatch(setGenericError(e))
    } finally {
      setDeletingCards(false);
    }
  }

  const handlePageChange = (_event: unknown, value: number) => {
    setPage(value);
  }

  const filter = searchFilter.value.toLowerCase();

  const filteredCards = cards === null ? null : cards.filter(card => (
    card.front.toLowerCase().includes(filter) || card.back.toLowerCase().includes(filter)
  )).reverse();

  const pageLength = 4;
  const pagesCount = filteredCards ? Math.ceil(filteredCards.length / pageLength) : 0;

  const paginatedCards = filteredCards === null ?
    null :
    filteredCards.slice((page - 1) * pageLength, Math.min(page * pageLength, filteredCards.length));

  useEffect(() => {
    if (page >= pagesCount) {
      setPage(pagesCount);
    } else if (page === 0) {
      setPage(1);
    }
  }, [pagesCount, filter]);

  const cardsList = () => {
    if (paginatedCards === null) {
      return <Stack alignItems="center"><CircularProgress /></Stack>;
    }

    if (!paginatedCards.length && !showNewCard) {
      return <Typography>No cards found.</Typography>;
    }

    return (
      <>
        {showNewCard && (
          <Card
            card={null}
            deckId={deck.id}
            submitCallback={appendCard}
            selected={false}
            toggleSelected={() => {}}
          />
        )}
        {paginatedCards.map(card => (
          <Card
            key={card.id}
            card={card}
            deckId={deck.id}
            submitCallback={updateCard}
            selected={selectedCards.includes(card.id)}
            toggleSelected={toggleSelected}
          />
        ))}
        <Pagination
          count={pagesCount}
          page={page}
          onChange={handlePageChange}
          sx={{
            marginTop: 2,
            '& .MuiPagination-ul': {
              justifyContent: 'center'
            }
          }}
        />
      </>
    );
  }

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
          )}/>
        </Grid>
        <Grid item xs={12} >
          <Typography variant="h6">Cards</Typography>
          <Grid container gap={1} columns={{ xs: 6, sm: 12 }} alignItems="stretch">
            <Grid item xs >
              <Button
                color="success"
                variant="contained"
                fullWidth
                disabled={showNewCard}
                onClick={() => setShowNewCard(true)}
              >
                Add
              </Button>
            </Grid>
            <Grid item xs >
              <LoadingButton
                color="error"
                variant="contained"
                fullWidth
                disabled={deletingCards || !selectedCards.length}
                onClick={deleteCards}
                loading={deletingCards}
                sx={{
                  height: '100%'
                }}
              >
                {!deletingCards && "Remove"}
              </LoadingButton>
            </Grid>
            <Grid item xs={6} >
              <Search searchField={searchFilter}/>
            </Grid>
          </Grid>
          <List>
            {cardsList()}
          </List>
        </Grid>
      </Grid>
    </DynamicForm>
  );
};

export default DeckEditForm;
