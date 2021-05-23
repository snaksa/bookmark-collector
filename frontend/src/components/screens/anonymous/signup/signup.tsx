import React from "react";
import { useHistory } from "react-router";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Copyright from "../../../organisms/copyright";
import RegisterForm, {
  FormFields,
} from "../../../forms/auth-forms/register-form";
import useHttpPost from "../../../../hooks/useHttpPost";

interface RegisterResponse {
  id: string;
}

export default function SignUpScreen(): JSX.Element {
  const history = useHistory();
  const { error, isLoading, execute: register } = useHttpPost(`auth/register`);

  const onSubmit = (data: FormFields) => {
    register(data).then((responseData: RegisterResponse) => {
      if (responseData) {
        history.push("/login");
      }
    });
  };

  return (
    <Container maxWidth="xs">
      <CssBaseline />
      <RegisterForm onSubmit={onSubmit} isLoading={isLoading} />
      <Box>{error?.message}</Box>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
