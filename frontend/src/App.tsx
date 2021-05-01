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
import BookmarksProvider from "./hooks/useBookmarks";
import FavoritesScreen from "./components/screens/private/favorites/favorites";
import ArchivedScreen from "./components/screens/private/archived/archived";
import TagsScreen from "./components/screens/private/tags/tags";

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
      <BookmarksProvider>
        <ThemeProvider theme={theme}>
          <Router>
            <Switch>
              <Route path="/login">
                <LoginScreen/>
              </Route>
              <Route path="/signup">
                <SignUpScreen/>
              </Route>
              <Route path="/my-list/favorites">
                <PrivateRoute screen={<FavoritesScreen/>}/>
              </Route>
              <Route path="/my-list/archived">
                <PrivateRoute screen={<ArchivedScreen/>}/>
              </Route>
              <Route path="/my-list/tags">
                <PrivateRoute screen={<TagsScreen/>}/>
              </Route>
              <Route path="/my-list">
                <PrivateRoute screen={<MyListScreen/>}/>
              </Route>
              <Route path="/">
                <HomeScreen/>
              </Route>
            </Switch>
          </Router>
        </ThemeProvider>
      </BookmarksProvider>
    </AuthProvider>
  );
}

export default App;
