import React from 'react';

import {
  Container,
  Link,
  Typography
} from '@mui/material';

const Footer = (): React.JSX.Element => {
  return (
    <Container
      maxWidth={false}
      sx={{
        backgroundColor: 'primary.dark',
        color: 'primary.contrastText',
        padding: 2,
        textAlign: 'right'
      }}
    >
      <Typography
        variant="body2"
      >
        made by <span> </span>
        <Link
          color="inherit"
          href="https://augustogunsch.com"
          target="_blank"
        >
          Augusto Gunsch
        </Link>
      </Typography>
    </Container>
  );
};

export default Footer;
