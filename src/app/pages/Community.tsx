import React from 'react';
import {
  Box,
  Typography
} from '@mui/material';

import Layout from '../components/Layout/Layout';
import Deck from '../components/Community/Deck';
import Paginated from '../components/Layout/Paginated';
import decksService from '../services/deckService';
import type { IDeck } from '../services/deckService';

const Community = (): React.JSX.Element => {
  const getDecks = async (
    page: number,
    pageLength: number,
    filter: string
  ): Promise<{
    elements: IDeck[]
    count: number
  }> => {
    const decks = decksService.getDecks({
      q: filter,
      limit: pageLength,
      offset: (page - 1) * pageLength
    });
    const decksCount = decksService.countDecks({
      q: filter
    });

    return {
      elements: (await decks).data,
      count: (await decksCount).data
    };
  };

  return (
    <Layout>
      <Box>
        <Typography
          variant="h4"
          mb={2}
        >
          Community decks
        </Typography>
        <Paginated
          pageLength={10}
          elementNamePlural="decks"
          filter
          elementMapper={deck => (
            <Deck deck={deck} key={deck.id} />
          )}
          getElements={getDecks}
        />
      </Box>
    </Layout>
  );
};

export default Community;
