import React, { useState } from "react";
import { useHistory } from "react-router";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Copyright from "../../../organisms/copyright";
import LoginForm, { FormFields } from "../../../forms/auth-forms/login-form";
import { useAuth } from "../../../../hooks/useAuth";
import UserService from "../../../../services/user.service";

export default function LoginScreen(): JSX.Element {
  const history = useHistory();
  const { onLogin } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const onSubmit = (values: FormFields) => {
    setIsLoading(true);
    setError("");

    const params = { email: values.email, password: values.password };
    UserService.login(params).then(({ data, error }) => {
      setIsLoading(false);

      if (error) {
        setError(error.message);
      } else if (data) {
        onLogin(data.tokens.IdToken);
        history.push("/my-list");
      }
    });
  };

  return (
    <Container maxWidth="xs">
      <CssBaseline />
      <LoginForm onSubmit={onSubmit} isLoading={isLoading} />
      <Box>{error}</Box>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
