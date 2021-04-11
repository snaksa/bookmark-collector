import React, {useState} from 'react';
import {Avatar, Button, Grid, TextField, Typography} from "@material-ui/core";
import {NavLink} from "react-router-dom";
import {Formik, Form} from 'formik';
import * as Yup from 'yup';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import useStyles from "./styles";
import HttpClient from "../../../services/http-client";

interface PropTypes {
  onSuccess?: Function;
  isLogin?: boolean;
  title: string;
}

interface FormFields {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
}

export default function AuthForm({onSuccess, isLogin, title}: PropTypes) {
  const classes = useStyles();
  const [error, setError] = useState<string>('');
  const [submitting, isSubmitting] = useState<boolean>(false);

  const schema = () => {
    let shape: any = {
      email: Yup.string().email().required("Enter email"),
      password: Yup.string().required("Enter password"),
    };

    if (!isLogin) {
      shape = {
        ...shape,
        firstName: Yup.string().required("Enter first name"),
        lastName: Yup.string().required("Enter last name"),
      };
    }

    return Yup.object().shape(shape);
  };

  const onSubmit = (values: FormFields) => {
    isSubmitting(true);
    let data = {
      email: values.email,
      password: values.password,
      ...(isLogin ? {} : {
        // todo add first and last name
      }),
    };
    HttpClient.post(`https://5eujqj1lva.execute-api.us-east-1.amazonaws.com/prod/auth/${isLogin ? 'login' : 'register'}`, {}, data).then(data => {
      isSubmitting(false);
      if (data.status === 200) {
        if (onSuccess) {
          onSuccess(data);
        }
      } else {
        setError(data.data);
      }
    });
  }

  return <div className={classes.paper}>
    <Avatar className={classes.avatar}>
      <LockOutlinedIcon/>
    </Avatar>
    <Typography component="h1" variant="h5">
      {title}
    </Typography>
    <Formik
      validationSchema={schema}
      initialValues={{
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      }}
      onSubmit={onSubmit}
    >
      {({errors, touched, values, handleChange, handleBlur}) => (
        <Form className={classes.form} noValidate={true}>
          <Grid container spacing={2}>
            {
              !isLogin && <>
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
              </>
            }

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
            disabled={submitting}
          >
            {title.toUpperCase()}
          </Button>
          {error}
          {
            !isLogin && <Grid container justify="flex-end">
              <Grid item>
                <NavLink to={'/login'}>Already have an account? Sign in</NavLink>
              </Grid>
            </Grid>
          }
        </Form>
      )}

    </Formik>
  </div>;
}