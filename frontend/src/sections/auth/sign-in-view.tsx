import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { useAppDispatch, useAppSelector } from 'src/hooks';

import { Iconify } from 'src/components/iconify';

import ErrorMessage from '../error/error-message';
import { login } from '../user/actions/userActions';

export function SignInView() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const userLogin = useAppSelector((state: any) => state.userLogin);
  const { error, userInfo } = userLogin;

  const handleSignIn = useCallback(() => {
    dispatch(login(email, password));
  }, [dispatch, email, password]);

  
    useEffect(() => {
      if (userInfo) {
        router.push('/');
      }
    }, [router, userInfo]);

  const renderForm = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: 'column',
        textAlign: 'center'
      }}
    >
      <TextField
        fullWidth
        name="email"
        label="Email address"
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
        onChange={(e) => setEmail(e.target.value)}
      />

      <TextField
        fullWidth
        name="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Button
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleSignIn}
      >
        Sign in
      </Button>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          gap: 1.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 5,
        }}
      >
        <Typography variant="h5">Sign in</Typography>
        <img src='../../../assets/images/playstudios.png' width="30%"/>
        {error && <ErrorMessage variant="filled">{error}</ErrorMessage>}
      </Box>
      {renderForm}
      <Box
        sx={{
          gap: 1.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 5,
        }}
      >
        <img src='../../../assets/images/abe.png' width="15%"/>
      </Box>

    </>
  );
}
