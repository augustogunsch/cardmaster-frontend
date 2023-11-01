import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '../hooks';
import { selectUser } from '../slices/userSlice';
import Layout from '../components/Layout/Layout';

import Typography from '@mui/material/Typography';

const Home = (): React.JSX.Element => {
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.isSuccess()) {
      navigate('/login');
    }
  }, []);

  return (
    <Layout>
      <Typography variant="h6">
        Welcome back, {user.value?.username}!
      </Typography>
    </Layout>
  );
};

export default Home;
