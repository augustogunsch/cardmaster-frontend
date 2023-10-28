import { useEffect, useState } from 'react';

import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';

import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';
import ClearIcon from '@mui/icons-material/Clear';

import { useRequiredField, useAppSelector, useAppDispatch, useValidate } from '../hooks';
import cardService, { Card as CardType } from '../services/cardService';
import { setGenericError } from '../slices/messageSlice';

type CardProps = {
  card: CardType | null,
  deckId: number,
  selected: boolean,
  submitCallback: (card?: CardType) => void,
  toggleSelected: (id: number) => void
}

const Card = ({card, deckId, selected, toggleSelected, submitCallback}: CardProps) => {
  const front = useRequiredField('Front', 'text');
  const back = useRequiredField('Back', 'text');
  const validate = useValidate([front.validate, back.validate]);
  const [modified, setModified] = useState(false);
  const token = useAppSelector(store => store.user.token);
  const dispatch = useAppDispatch();

  const resetDefault = () => {
    if (card !== null) {
      front.setValue(card.front);
      back.setValue(card.back);
    } else {
      front.setValue('');
      back.setValue('');
    }
    front.setError('');
    back.setError('');
  };

  useEffect(() => {
    resetDefault();
  }, [card]);

  useEffect(() => {
    if (card !== null && front.value && back.value) {
      setModified(front.value !== card.front || back.value !== card.back);
    } else {
      setModified(Boolean(front.value.trim()) || Boolean(back.value.trim()));
    }
  }, [front, back]);

  const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    if (validate()) {
      try {
        if (card) {
          const newCard = {...card, front: front.value, back: back.value};
          const response = await cardService.updateCard(newCard, token);
          submitCallback(response.data);
        } else {
          const newCard = {front: front.value, back: back.value};
          const response = await cardService.createCard(newCard, deckId, token);
          submitCallback(response.data);
        }
      } catch (e) {
        dispatch(setGenericError(e));
      }
    }
  };

  return (
    <ListItem
      sx={{
        padding: 0,
        marginTop: 2,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%'
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{
            width: '100%'
          }}
        >
          {card && (
            <Checkbox
              checked={selected}
              onChange={() => card && toggleSelected(card.id)}
            />
          )}
          {!card && (
            <IconButton
              color="inherit"
              onClick={() => submitCallback()}
            >
              <ClearIcon />
            </IconButton>
          )}
          <TextField
            required
            label="Front"
            variant="standard"
            fullWidth
            autoFocus={Boolean(!card)}
            {...front.inputProps}
          />
          <TextField
            required
            label="Back"
            variant="standard"
            fullWidth
            {...back.inputProps}
          />
        </Stack>
        {modified && (
          <Stack
            direction="row"
            spacing={1}
            justifyContent="flex-end"
            mt={1}
            sx={{
            }}
          >
            <IconButton
              aria-label="save"
              onClick={resetDefault}
            >
              <UndoOutlinedIcon />
            </IconButton>
            <IconButton
              aria-label="save"
              type="submit"
              formNoValidate
            >
              <SaveOutlinedIcon />
            </IconButton>
          </Stack>
        )}
      </form>
    </ListItem>
  );
};

export default Card;
