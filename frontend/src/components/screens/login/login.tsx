import React from 'react';
import {useHistory} from 'react-router';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Copyright from '../../organisms/copyright/copyright';
import AuthForm from '../../forms/auth-form/auth-form';
import {useAuth} from "../../../hooks/useAuth";

export default function LoginScreen() {
  const history = useHistory();
  const {onLogin} = useAuth();

  const onSuccess = (data: any) => {
    onLogin(data.data.IdToken);
    history.push('/');
  }

  return (
    <Container maxWidth="xs">
      <CssBaseline/>
      <AuthForm onSuccess={onSuccess} isLogin={true} title="Sign In"/>
      <Box mt={5}>
        <Copyright/>
      </Box>
    </Container>
  );
}