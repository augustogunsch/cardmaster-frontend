import React, { useState } from 'react';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';

import IconButtonAlternate from '../IconButtonAlternate';
import DeckEditForm from './DeckEditForm';
import ConfirmDialog from '../ConfirmDialog';
import { deleteDeck, duplicateDeck } from '../../slices/decksSlice';
import { useAppSelector, useAppDispatch, useLoad } from '../../hooks';
import cardService from '../../services/cardService';
import type { IDeck } from '../../services/deckService';

export interface IProps {
  deck: IDeck
}

const Deck = ({ deck }: IProps): React.JSX.Element => {
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const token = useAppSelector(store => store.user.token);

  const dispatch = useAppDispatch();

  const [newCardsCount] = useLoad(async () =>
    await cardService.countCards(deck.id, token, { new: true }),
  [expanded], expanded);

  const [dueCardsCount] = useLoad(async () =>
    await cardService.countCards(deck.id, token, { due: new Date().toISOString() }),
  [expanded], expanded);

  const handleOpen = (event: React.MouseEvent<HTMLElement>): void => {
    event.stopPropagation();
    setOpenForm(true);
  };

  const handleDuplicate = (event: React.MouseEvent<HTMLElement>): void => {
    event.stopPropagation();
    void dispatch(duplicateDeck(deck.id));
  };

  const handleDelete = (): void => {
    void dispatch(deleteDeck(deck.id));
    setOpenDeleteDialog(false);
  };

  const handleExpand = (_event: React.SyntheticEvent, isExpanded: boolean): void => {
    setExpanded(isExpanded);
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={handleExpand}
    >
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
        {(newCardsCount === null || dueCardsCount === null) && expanded && (
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            height="96px"
          >
            <CircularProgress/>
          </Stack>
        )}
        {newCardsCount !== null && dueCardsCount !== null && (
          <Grid container>
            <Grid item xs={6}>
              <Typography>Shared: {deck.shared ? 'Yes' : 'No'}</Typography>
              <Typography>Number of cards: {deck.cards_count}</Typography>
              <Typography>New cards: {newCardsCount}</Typography>
              <Typography>Due cards: {dueCardsCount}</Typography>
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
                  onClick={() => { setOpenDeleteDialog(true); }}
                >
                  Delete deck
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}
      </AccordionDetails>
      <DeckEditForm
        open={openForm}
        handleClose={() => { setOpenForm(false); }}
        deck={deck}
      />
      <ConfirmDialog
        open={openDeleteDialog}
        handleClose={() => { setOpenDeleteDialog(false); }}
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
