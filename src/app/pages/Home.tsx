import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '../hooks';
import Layout from '../components/Layout/Layout';

import Typography from '@mui/material/Typography';

const Home = (): React.JSX.Element => {
  const user = useAppSelector(store => store.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.self == null) {
      navigate('/login');
    }
  }, []);

  return (
    <Layout>
      <Typography variant="h6">
        Welcome back, {user.self?.username}!
      </Typography>
    </Layout>
  );
};

export default Home;
