import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Copyright from '../../organisms/copyright/copyright';
import AuthForm from '../../forms/auth-form/auth-form';

export default function RegisterScreen() {
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <AuthForm isLogin={true} title="Sign In"/>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}