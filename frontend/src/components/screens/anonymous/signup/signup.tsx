import React, { useState } from "react";
import { useHistory } from "react-router";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Copyright from "../../../organisms/copyright";
import RegisterForm, {
  FormFields,
} from "../../../forms/auth-forms/register-form";
import UserService from "../../../../services/user.service";

export default function SignUpScreen(): JSX.Element {
  const history = useHistory();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const onSubmit = (values: FormFields) => {
    setIsLoading(true);
    setError("");
    const params = {
      email: values.email,
      password: values.password,
      firstName: values.firstName,
      lastName: values.lastName,
    };

    UserService.register(params).then(({ data, error }) => {
      setIsLoading(false);
      if (error) {
        setError(error.message);
      } else if (data && data.id) {
        history.push("/login");
      }
    });
  };

  return (
    <Container maxWidth="xs">
      <CssBaseline />
      <RegisterForm onSubmit={onSubmit} isLoading={isLoading} />
      <Box>{error}</Box>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
