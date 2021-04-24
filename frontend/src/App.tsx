import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import {createMuiTheme, ThemeProvider} from "@material-ui/core";
import AuthProvider from './hooks/useAuth'
import LoginScreen from "./components/screens/anonymous/login/login"
import SignUpScreen from "./components/screens/anonymous/signup/signup";
import HomeScreen from "./components/screens/anonymous/home/home";
import axios from 'axios';
import MyListScreen from "./components/screens/private/my-list/my-list";
import PrivateRoute from "./components/screens/private/private";

axios.interceptors.request.use(function (config) {
  // add Authorization header if token is available
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }

  return config;
});

const theme = createMuiTheme({
  palette: {
    background: {
      default: '#f5eddd',
    },
    primary: {
      main: '#00736c'
    },
    secondary: {
      main: '#d8decf'
    },
  },
  spacing: 4,
});

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route path="/login">
              <LoginScreen/>
            </Route>
            <Route path="/signup">
              <SignUpScreen/>
            </Route>
            <Route path="/my-list">
              <PrivateRoute screen={<MyListScreen/>}/>
            </Route>
            <Route path="/my-list/archived">
              <PrivateRoute screen={<MyListScreen/>}/>
            </Route>
            <Route path="/">
              <HomeScreen/>
            </Route>
          </Switch>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;