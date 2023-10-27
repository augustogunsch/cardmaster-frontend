import { useState } from 'react';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';

import DeckEditForm from '../components/DeckEditForm'
import type { Deck } from '../services/deckService'

type DeckAccordionProps = {
  deck: Deck,
  children: JSX.Element | JSX.Element[]
}

const DeckAccordion = ({deck, children}: DeckAccordionProps) => {
  const [openForm, setOpenForm] = useState(false);

  const handleOpen = (event: React.MouseEvent<SVGSVGElement>) => {
    event.stopPropagation();
    setOpenForm(true);
  };

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            mr: 1
          }}
        >
          <Typography>{deck.name}</Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 1
            }}
          >
            <CreateOutlinedIcon
              sx={{color: "grey.600"}}
              onClick={handleOpen}
            />
            <PlayArrowOutlinedIcon sx={{color: "grey.600"}} />
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {children}
      </AccordionDetails>
      <DeckEditForm
        open={openForm}
        handleClose={() => setOpenForm(false)}
        deck={deck}
      />
    </Accordion>
  );
};

export default DeckAccordion;
