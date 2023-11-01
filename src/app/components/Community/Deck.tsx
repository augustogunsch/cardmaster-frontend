import React from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Grid,
  IconButton,
  Typography
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DownloadIcon from '@mui/icons-material/Download';
import DoneIcon from '@mui/icons-material/Done';

import IconButtonAlternate from '../IconButtonAlternate';
import { useAppDispatch, useAppSelector } from '../../hooks';
import userService from '../../services/userService';
import { loadDecks } from '../../slices/decksSlice';
import { setGenericError, setSuccess } from '../../slices/messageSlice';
import { selectUser } from '../../slices/userSlice';
import type { IDeck } from '../../services/deckService';

interface IProps {
  deck: IDeck
}

const Deck = ({ deck }: IProps): React.JSX.Element => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleGetDeck = (e: React.MouseEvent<HTMLElement>): void => {
    e.stopPropagation();

    if (!user.isSuccess()) {
      navigate('/login');
    } else {
      userService.addDeck(user.value.id, deck.id, user.value.token).then(() => {
        void dispatch(loadDecks());
        dispatch(setSuccess('Deck added to collection'));
      }).catch(e => {
        void dispatch(setGenericError(e));
      });
    }
  };

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<IconButton><ExpandMoreIcon /></IconButton>}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Typography>{deck.name}</Typography>
          </Box>
          <Box>
            <IconButtonAlternate
              aria-label="Get deck"
              onClick={handleGetDeck}
              disabled={deck.user === user.value?.username}
              iconA={<DownloadIcon />}
              iconB={<DoneIcon/>}
            />
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container>
          <Grid item xs={6}>
            <Typography>Author: {deck.user}</Typography>
            <Typography>Number of cards: {deck.cards_count}</Typography>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default Deck;
