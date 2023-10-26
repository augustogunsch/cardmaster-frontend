import { login } from '../slices/userSlice'
import { useField, useAppDispatch } from '../hooks'
import Layout from '../components/Layout'
import { setError } from '../slices/messageSlice'
import { AxiosError } from 'axios'

import userService from '../services/userService';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const Login = () => {
  const dispatch = useAppDispatch();
  const [username, setUsernameError] = useField('text');
  const [password, setPasswordError] = useField('password');

  const validate = () => {
    var success = true;

    if (!username.value) {
      setUsernameError('Username is required');
      success = false;
    }

    if (!password.value) {
      setPasswordError('Password is required');
      success = false;
    }

    return success;
  };

  const handleLogin = () => {
    if (validate()) {
      dispatch(login(username.value, password.value));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleLogin();
  };

  const handleRegister = async () => {
    if (validate()) {
      try {
        await userService.register(username.value, password.value);
        dispatch(login(username.value, password.value));
      } catch (e) {
        if (e instanceof AxiosError) {
          dispatch(setError(e.response ? e.response.data.message : e.message));
        }
      }
    }
  }

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
              padding: 4,
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
                  Welcome back. Please login to your account.
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Username"
                  variant="standard"
                  {...username}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Password"
                  variant="standard"
                  {...password}
                />
              </Grid>
              <Grid item xs={6}>
                <Button
                  color="primary"
                  variant="outlined"
                  fullWidth
                  onClick={handleRegister}
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

export default Login
