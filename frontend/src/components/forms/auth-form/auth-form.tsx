import { Avatar, Button, Grid, Link, TextField, Typography } from "@material-ui/core";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import useStyles from "./styles";

interface PropTypes {
    isLogin?: boolean;
    title: string;
};

export default function AuthForm({ isLogin, title }: PropTypes) {
    const classes = useStyles();

    const schema = () => {
        return Yup.object().shape({
            firstName: Yup.string().required("Enter first name"),
            lastName: Yup.string().required("Enter last name"),
            email: Yup.string().email().required("Enter email"),
            password: Yup.string().required("Enter password"),
        });
    };

    return <div className={classes.paper}>
        <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
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
            onSubmit={(values) => {
                console.log(values);
            }}
        >
            {({ errors, touched, values, handleChange, handleBlur }) => (
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
                    >
                        {title.toUpperCase()}
                    </Button>
                    {
                        !isLogin && <Grid container justify="flex-end">
                            <Grid item>
                                <Link href="#" variant="body2">
                                    Already have an account? Sign in
                    </Link>
                            </Grid>
                        </Grid>
                    }
                </Form>
            )}

        </Formik>
    </div>;
}