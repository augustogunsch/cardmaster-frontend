import { useState } from 'react';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';

import IconButtonAlternate from '../IconButtonAlternate';
import DeckEditForm from './DeckEditForm'
import ConfirmDialog from '../ConfirmDialog'
import { deleteDeck, duplicateDeck } from '../../slices/decksSlice';
import { useAppDispatch } from '../../hooks';
import type { Deck } from '../../services/deckService'

type DeckAccordionProps = {
  deck: Deck
}

const Deck = ({deck}: DeckAccordionProps) => {
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const dispatch = useAppDispatch();

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setOpenForm(true);
  };

  const handleDuplicate = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    dispatch(duplicateDeck(deck.id));
  };

  const handleDelete = () => {
    dispatch(deleteDeck(deck.id));
    setOpenDeleteDialog(false);
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
              aria-label="Duplicate deck"
              onClick={handleDuplicate}
              iconA={<ContentCopyIcon />}
              iconB={<DoneIcon/>}
            />
            <IconButton
              aria-label="Edit deck"
              onClick={handleOpen}
            >
              <CreateOutlinedIcon />
            </IconButton>
            <IconButton
              aria-label="Train deck"
            >
              <PlayArrowOutlinedIcon />
            </IconButton>
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container>
          <Grid item xs={6}>
            <Typography>Author: {deck.author}</Typography>
            <Typography>Shared: {deck.shared ? 'Yes' : 'No'}</Typography>
            <Typography>Number of cards: {deck.cards_count}</Typography>
          </Grid>
          <Grid
            item
            xs={6}
          >
            <Box
              display="flex"
              justifyContent="end"
              alignItems="end"
              height="100%"
            >
              <Button
                variant="text"
                color="error"
                onClick={() => setOpenDeleteDialog(true)}
              >
                Delete deck
              </Button>
            </Box>
          </Grid>
        </Grid>
      </AccordionDetails>
      <DeckEditForm
        open={openForm}
        handleClose={() => setOpenForm(false)}
        deck={deck}
      />
      <ConfirmDialog
        open={openDeleteDialog}
        handleClose={() => setOpenDeleteDialog(false)}
        handleConfirm={handleDelete}
        title="Delete deck"
        deleteButton
      >
        <Typography>Are you sure you want to delete this deck?</Typography>
      </ConfirmDialog>
    </Accordion>
  );
};

export default Deck;
