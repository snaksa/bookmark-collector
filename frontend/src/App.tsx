import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import {Container} from "@material-ui/core";
import AuthProvider from './hooks/useAuth'
import LoginScreen from "./components/screens/login/login"
import SignUpScreen from "./components/screens/signup/signup";
import HomeScreen from "./components/screens/home/home";

function App() {
  return (
    <AuthProvider>
      <Container>
        <Router>
          <Switch>
            <Route path="/login">
              <LoginScreen/>
            </Route>
            <Route path="/signup">
              <SignUpScreen/>
            </Route>
            <Route path="/">
              <HomeScreen/>
            </Route>
          </Switch>
        </Router>
      </Container>
    </AuthProvider>
  );
}

export default App;
