import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import Layout from '../components/Layout'
import Deck from '../components/Community/Deck'
import Paginated from '../components/Paginated'
import decksService from '../services/deckService'

const Community = () => {
  const getDecks = async (page: number, pageLength: number, filter: string) => {
    const decks = decksService.getDecks(filter, pageLength, (page - 1) * pageLength);
    const decksCount = decksService.getDecksCount(filter);

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
