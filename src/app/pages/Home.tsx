import React from 'react';

import { useAppSelector } from '../hooks';
import Layout from '../components/Layout/Layout';

import Typography from '@mui/material/Typography';
import { CircularProgress } from '@mui/material';

const Home = (): React.JSX.Element => {
  const user = useAppSelector(state => state.user);

  return (
    <Layout>
      <>
      {user.status === 'initial' && (
        <CircularProgress />
      )}
      {user.status === 'failed' && (
        <Typography variant="h6">
          Welcome to CardMaster! Here you will find
        </Typography>
      )}
      {user.entity !== null && (
        <Typography variant="h6">
          Welcome back, {user.entity.username}!
        </Typography>
      )}
      </>
    </Layout>
  );
};

export default Home;
