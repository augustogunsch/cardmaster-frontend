import { useEffect, useState } from 'react';

import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';

import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';

import { useRequiredField, useAppSelector, useAppDispatch } from '../hooks';
import cardService, { Card as CardType } from '../services/cardService';
import { setSuccess, setGenericError } from '../slices/messageSlice';

type CardProps = {
  card: CardType,
  updateCard: (card: CardType) => void
}

const Card = ({card, updateCard}: CardProps) => {
  const front = useRequiredField('Front', 'text');
  const back = useRequiredField('Back', 'text');
  const [modified, setModified] = useState(false);
  const token = useAppSelector(store => store.user.token);
  const dispatch = useAppDispatch();

  const resetDefault = () => {
    front.setValue(card.front);
    back.setValue(card.back);
  };

  useEffect(() => {
    resetDefault();
  }, [card]);

  useEffect(() => {
    setModified(front.value !== card.front || back.value !== card.back);
  }, [front, back]);

  const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    const newCard = {...card, front: front.value, back: back.value};

    try {
      const response = await cardService.updateCard(newCard, token);
      updateCard(response.data);
      dispatch(setSuccess('Card updated succesfully'));
    } catch (e) {
      dispatch(setGenericError(e));
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
          <Checkbox />
          <TextField
            required
            label="Front"
            variant="standard"
            fullWidth
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
