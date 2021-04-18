import React from 'react';
import { Avatar, Button, Grid, TextField, Typography } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import useStyles from "./styles";

interface PropTypes {
  onSubmit: Function;
  isLoading: boolean;
}

export interface FormFields {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default function RegisterForm({ onSubmit, isLoading }: PropTypes) {
  const classes = useStyles();

  const schema = () => {
    const shape = {
      email: Yup.string().email().required("Enter email"),
      password: Yup.string().required("Enter password"),
      firstName: Yup.string().required("Enter first name"),
      lastName: Yup.string().required("Enter last name"),
    };

    return Yup.object().shape(shape);
  };

  const submit = (values: FormFields) => {
    let data = {
      email: values.email,
      password: values.password,
      // TODO: add first name and last name
    };

    onSubmit(data);
  }

  return <div className={classes.paper}>
    <Avatar className={classes.avatar}>
      <LockOutlinedIcon />
    </Avatar>
    <Typography component="h1" variant="h5">
      Sign Up
    </Typography>
    <Formik
      validationSchema={schema}
      initialValues={{
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      }}
      onSubmit={submit}
    >
      {({ errors, touched, values, handleChange, handleBlur }) => (
        <Form className={classes.form} noValidate={true}>
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
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!(errors.password && touched.password)}
                helperText={touched.password && errors.password}
              />
            </Grid>
          </Grid>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={isLoading}
          >
            Sign In
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <NavLink to={'/login'}>Already have an account? Sign in</NavLink>
            </Grid>
          </Grid>
        </Form>
      )}

    </Formik>
  </div>;
}