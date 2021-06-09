import React from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import useStyle from "./styles";
import { useAppDispatch } from "../../../../hooks/redux-hooks";
import { changeUserPassword } from "../../../../redux/slices/users/thunks";

interface FormFields {
  oldPassword: string;
  newPassword: string;
}

export default function ChangePasswordScreen(): JSX.Element {
  const classes = useStyle();
  const dispatch = useAppDispatch();

  const schema = () => {
    const shape = {
      oldPassword: Yup.string().required("Enter your old password"),
      newPassword: Yup.string().required("Enter your new password"),
    };

    return Yup.object().shape(shape);
  };

  const submit = (values: FormFields) => {
    dispatch(
      changeUserPassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      })
    );
  };

  return (
    <Container>
      <Typography variant={"h4"}>Change Password</Typography>
      <Box className={classes.main}>
        <Formik
          validationSchema={schema}
          enableReinitialize={true}
          initialValues={{
            oldPassword: "",
            newPassword: "",
          }}
          onSubmit={submit}
        >
          {({ errors, touched, values, handleChange, handleBlur }) => (
            <Form noValidate={true}>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    type="password"
                    name="oldPassword"
                    variant="outlined"
                    id="oldPassword"
                    label="Old Password"
                    value={values.oldPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!(errors.oldPassword && touched.oldPassword)}
                    helperText={touched.oldPassword && errors.oldPassword}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    type="password"
                    variant="outlined"
                    id="newPassword"
                    name="newPassword"
                    label="New Password"
                    value={values.newPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!(errors.newPassword && touched.newPassword)}
                    helperText={touched.newPassword && errors.newPassword}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth={true}
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={false}
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
}
