import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '../hooks'
import Layout from '../components/Layout'

import Typography from '@mui/material/Typography'

const Home = () => {
  const user = useAppSelector(store => store.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.id) {
      navigate('/login');
    }
  }, []);

  return (
    <Layout>
      <Typography variant="h6">
        Welcome back, {user.username}!
      </Typography>
    </Layout>
  );
};

export default Home;
