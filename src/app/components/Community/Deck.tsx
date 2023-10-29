import { useNavigate } from 'react-router-dom';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DownloadIcon from '@mui/icons-material/Download';
import DoneIcon from '@mui/icons-material/Done';

import IconButtonAlternate from '../IconButtonAlternate';
import { useAppDispatch, useAppSelector } from '../../hooks';
import userService from '../../services/userService';
import { loadDecks } from '../../slices/decksSlice'
import { setGenericError, setSuccess } from '../../slices/messageSlice'
import type { Deck } from '../../services/deckService'

type DeckAccordionProps = {
  deck: Deck
}

const Deck = ({deck}: DeckAccordionProps) => {
  const user = useAppSelector(store => store.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleGetDeck = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();

    if (!user.id) {
      navigate('/login');
    } else {
      userService.addDeck(user.id, deck.id, user.token).then(() => {
        dispatch(loadDecks());
        dispatch(setSuccess('Deck added to collection'))
      }).catch(error => {
        dispatch(setGenericError(error))
      });
    }
  }

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<IconButton><ExpandMoreIcon /></IconButton>}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
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
              disabled={deck.author === user.username}
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
