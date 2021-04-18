import React from 'react';
import { useHistory } from 'react-router';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Copyright from '../../../organisms/copyright';
import LoginForm, { FormFields } from '../../../forms/auth-forms/login-form';
import { useAuth } from "../../../../hooks/useAuth";
import useHttpPost from '../../../../hooks/useHttpPost';

export default function LoginScreen() {
  const history = useHistory();
  const { onLogin } = useAuth();

  const { error, isLoading, execute: login } = useHttpPost(`auth/login`);

  const onSubmit = (data: FormFields) => {
    login(data)
      .then((responseData: any) => {
        if (responseData) {
          onLogin(responseData.tokens.IdToken);
          history.push('/my-list');
        }
      });
  }

  return (
    <Container maxWidth="xs">
      <CssBaseline />
      <LoginForm onSubmit={onSubmit} isLoading={isLoading} />
      <Box>{error?.message}</Box>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}