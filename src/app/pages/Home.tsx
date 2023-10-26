import { useAppSelector } from '../hooks'

import Layout from '../components/Layout'

import Typography from '@mui/material/Typography'

const Home = () => {
  const user = useAppSelector(store => store.user);

  return (
    <Layout>
      <Typography variant="h6">
        Welcome back, {user.username}!
      </Typography>
    </Layout>
  );
};

export default Home;
