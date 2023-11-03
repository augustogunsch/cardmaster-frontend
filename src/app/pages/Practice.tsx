import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
  Stack, Typography
} from '@mui/material';

import { useAppDispatch, useAppSelector, useLoad } from '../hooks';
import Loading from './Loading';
import cardService from '../services/cardService';
import Fullscreen from '../components/Layout/Fullscreen';
import { setError } from '../slices/messageSlice';
import Welcome from '../components/Practice/Welcome';
import Card from '../components/Practice/Card';
import type { ExtendedCard } from '../components/Practice/Card';
import End from '../components/Practice/End';
import { loadDecks } from '../slices/decksSlice';

const Practice = (): React.JSX.Element => {
  const { deckId } = useParams();
  const [stage, setStage] = useState(0);
  const [cards, setCards] = useState<ExtendedCard[]>([]);
  const [reviewCards, setReviewCards] = useState<ExtendedCard[]>([]);
  const [cardsToUpdate, setCardsToUpdate] = useState<ExtendedCard[]>([]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const decks = useAppSelector(store => store.decks);
  const user = useAppSelector(state => state.user);

  const deck = decks.entity?.find(deck => deck.id === Number(deckId));

  const [revisedCardsCount] = useLoad(async () =>
    user.entity !== null && deck != null
      ? await cardService.countCards(
        deck.id,
        user.entity.token,
        { revised: new Date().toISOString() }
      )
      : null,
  deck != null);

  const [newCards] = useLoad(async () =>
    user.entity !== null && deck != null
      ? await cardService.getCards(
        deck.id,
        user.entity.token,
        {
          new: true,
          limit: 10
        }
      )
      : null,
  deck != null);

  const [dueCards] = useLoad(async () =>
    user.entity !== null && deck != null
      ? await cardService.getCards(
        deck.id,
        user.entity.token,
        {
          due: new Date().toISOString(),
          limit: 20
        }
      )
      : null,
  deck != null);

  useEffect(() => {
    if (
      newCards.entity?.length === 0 &&
      dueCards.entity?.length === 0
    ) {
      dispatch(setError('No cards to review or learn'));
      navigate('/decks');
    } else if (
      newCards.entity !== null && dueCards.entity !== null
    ) {
      setCards(newCards.entity.concat(dueCards.entity).map(card => (
        { ...card, timesReviewed: 0 }
      )));
    }
  }, [newCards.entity, dueCards.entity]);

  if (
    newCards.entity === null ||
    dueCards.entity === null ||
    revisedCardsCount.entity === null ||
    deck === undefined ||
    user.entity === null ||
    cards.length === 0
  ) {
    return <Loading />;
  }

  const advanceCard = (card: ExtendedCard, review: boolean): void => {
    const newCards = [...cards];
    newCards.shift();

    if (!review) {
      setCardsToUpdate(cardsToUpdate.concat(card));
    }

    if (newCards.length === 0) {
      if (review) {
        setCards(reviewCards.concat(card));
      } else if (reviewCards.length === 0) {
        setStage(2);
      } else {
        setCards(reviewCards);
      }

      setReviewCards([]);
    } else {
      if (review) {
        setReviewCards(reviewCards.concat(card));
      }

      setCards(newCards);
    }
  };

  const handleClose = async (): Promise<void> => {
    const additionalCards = reviewCards.map(card => (
      {
        ...card,
        knowledge_level: card.knowledge_level + 1
      }
    ));
    await cardService.updateCards(cardsToUpdate.concat(additionalCards), user.entity?.token ?? '');
    void dispatch(loadDecks(true));
    navigate('/decks');
  };

  return (
    <Fullscreen
      handleClose={() => { void handleClose(); }}
      topElement={stage === 1 && <Typography>Cards remaining: {cards.length + reviewCards.length}</Typography>}
    >
      <Stack
        sx={{
          height: '100%',
          padding: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {stage === 0 && (
          <Welcome
            deckName={deck.name}
            revisedCardsCount={revisedCardsCount.entity}
            newCardsCount={newCards.entity.length}
            dueCardsCount={dueCards.entity.length}
            onContinue={() => { setStage(1); }}
          />
        )}
        {stage === 1 && (
          <Card
            card={cards[0]}
            advanceCard={advanceCard}
          />
        )}
        {stage === 2 && (
          <End
            handleClose={() => { void handleClose(); }}
          />
        )}
      </Stack>
    </Fullscreen>
  );
};

export default Practice;
