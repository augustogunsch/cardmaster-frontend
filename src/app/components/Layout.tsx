import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Layout = ({children}: {children: JSX.Element | JSX.Element[] | undefined}) => {
  return (
    <>
      <Container
        maxWidth={false}
        disableGutters
      >
        <Navbar />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            marginTop: 3,
            minHeight: '100vh'
          }}
        >
          <Container
            maxWidth="xl"
            sx={{
              marginBottom: 5
            }}
          >
            {children && children}
          </Container>
          <Footer />
        </Box>
      </Container>
    </>
  );
};

export default Layout;
