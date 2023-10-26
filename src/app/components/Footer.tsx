import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

const Footer = () => {
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
  )
};

export default Footer;
