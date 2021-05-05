import React from "react";
import {
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import * as Yup from "yup";
import { Form, Formik } from "formik";

interface FormFields {
  firstName: string;
  lastName: string;
  email: string;
}

export default function MyProfileScreen(): JSX.Element {
  const schema = () => {
    const shape = {
      email: Yup.string().email().required("Enter email"),
      firstName: Yup.string().required("Enter first name"),
      lastName: Yup.string().required("Enter last name"),
    };

    return Yup.object().shape(shape);
  };

  const submit = (values: FormFields) => {
    console.log(values);
    // let data = {
    //   email: values.email,
    //   password: values.password,
    //   // TODO: add first name and last name
    // };
  };

  return (
    <Container>
      <Typography variant={"h4"}>My Profile</Typography>
      <Formik
        validationSchema={schema}
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
        }}
        onSubmit={submit}
      >
        {({ errors, touched, values, handleChange, handleBlur }) => (
          <Form noValidate={true}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="firstName"
                  variant="outlined"
                  id="firstName"
                  label="First Name"
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!(errors.firstName && touched.firstName)}
                  helperText={touched.firstName && errors.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!(errors.lastName && touched.lastName)}
                  helperText={touched.lastName && errors.lastName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!(errors.email && touched.email)}
                  helperText={touched.email && errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth={true}
                  type="submit"
                  variant="contained"
                  color="primary"
                  // className={classes.submit}
                  disabled={false}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Container>
  );
}
