import React, { useState } from 'react';

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
  Stack
} from '@mui/material';

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
  const user = useAppSelector(state => state.user);

  const dispatch = useAppDispatch();

  const [newCardsCount] = useLoad(async () =>
    user.entity !== null
      ? await cardService.countCards(deck.id, user.entity.token, { new: true })
      : null,
  expanded);

  const [dueCardsCount] = useLoad(async () =>
    user.entity !== null
      ? await cardService.countCards(deck.id, user.entity.token, { due: new Date().toISOString() })
      : null,
  expanded);

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
        {(newCardsCount.entity === null || dueCardsCount.entity === null) && expanded && (
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            height="96px"
          >
            <CircularProgress/>
          </Stack>
        )}
        {newCardsCount.entity !== null && dueCardsCount.entity !== null && (
          <Grid container>
            <Grid item xs={6}>
              <Typography>Shared: {deck.shared ? 'Yes' : 'No'}</Typography>
              <Typography>Number of cards: {deck.cards_count}</Typography>
              <Typography>New cards: {newCardsCount.entity}</Typography>
              <Typography>Due cards: {dueCardsCount.entity}</Typography>
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
