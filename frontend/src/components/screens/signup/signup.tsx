import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Copyright from '../../organisms/copyright/copyright';
import AuthForm from '../../forms/auth-form/auth-form';

export default function SignUpScreen() {
  return (
    <Container maxWidth="xs">
      <CssBaseline/>
      <AuthForm title="Sign Up"/>
      <Box mt={5}>
        <Copyright/>
      </Box>
    </Container>
  );
}