import React from "react";
import { Avatar, Button, Grid, TextField, Typography } from "@material-ui/core";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import useStyles from "./styles";

interface PropTypes {
  onSubmit: any;
  isLoading: boolean;
}

export interface FormFields {
  email: string;
  password: string;
}

export default function LoginForm({ onSubmit, isLoading }: PropTypes) {
  const classes = useStyles();

  const schema = () => {
    const shape: any = {
      email: Yup.string().email().required("Enter email"),
      password: Yup.string().required("Enter password"),
    };

    return Yup.object().shape(shape);
  };

  const submit = (values: FormFields) => {
    const data = {
      email: values.email,
      password: values.password,
    };

    onSubmit(data);
  };

  return (
    <div className={classes.paper}>
      <Avatar classes={{ root: classes.avatar }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        LOGIN
      </Typography>
      <Formik
        validationSchema={schema}
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={submit}
      >
        {({ errors, touched, values, handleChange, handleBlur }) => (
          <Form className={classes.form} noValidate={true}>
            <Grid container spacing={2}>
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
              classes={{ root: classes.submit }}
              disabled={isLoading}
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
