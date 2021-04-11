import React from 'react';
import {useHistory} from 'react-router';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Copyright from '../../organisms/copyright/copyright';
import AuthForm from '../../forms/auth-form/auth-form';

export default function SignUpScreen() {
  const history = useHistory();
  const onSuccess = () => {
    history.push('/login');
  }

  return (
    <Container maxWidth="xs">
      <CssBaseline/>
      <AuthForm onSuccess={onSuccess} title="Sign Up"/>
      <Box mt={5}>
        <Copyright/>
      </Box>
    </Container>
  );
}