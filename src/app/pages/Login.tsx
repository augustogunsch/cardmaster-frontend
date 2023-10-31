import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Grid,
  Box,
  TextField,
  Typography
} from '@mui/material';

import { login } from '../slices/userSlice';
import { useRequiredField, useValidate, useAppDispatch, useAppSelector } from '../hooks';
import Layout from '../components/Layout/Layout';
import { setGenericError } from '../slices/messageSlice';
import userService from '../services/userService';

const Login = (): React.JSX.Element => {
  const user = useAppSelector(store => store.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const username = useRequiredField('Username', 'text');
  const password = useRequiredField('Password', 'password');
  const validate = useValidate([username.validate, password.validate]);

  useEffect(() => {
    if (user.id !== 0) {
      navigate('/');
    }
  }, [user]);

  const handleLogin = (): void => {
    if (validate()) {
      void dispatch(login(username.value, password.value));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    handleLogin();
  };

  const handleRegister = async (): Promise<void> => {
    if (validate()) {
      try {
        await userService.register(username.value, password.value);
        void dispatch(login(username.value, password.value));
      } catch (e) {
        void dispatch(setGenericError(e));
      }
    }
  };

  return (
    <Layout>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 4
        }}
      >
        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              borderColor: 'grey.400',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderRadius: '8px',
              backgroundColor: 'white',
              padding: 4
            }}
          >
            <Grid
              maxWidth={400}
              container
              spacing={2}
            >
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                >
                  Welcome. Please login to your account or sign up.
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Username"
                  variant="standard"
                  {...username.inputProps}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Password"
                  variant="standard"
                  {...password.inputProps}
                />
              </Grid>
              <Grid item xs={6}>
                <Button
                  color="primary"
                  variant="outlined"
                  fullWidth
                  onClick={() => { void handleRegister(); }}
                >
                  Sign up
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  color="primary"
                  variant="contained"
                  fullWidth
                  onClick={handleLogin}
                  type="submit"
                  formNoValidate
                >
                  Login
                </Button>
              </Grid>
            </Grid>
          </Box>
        </form>
      </Box>
    </Layout>
  );
};

export default Login;
