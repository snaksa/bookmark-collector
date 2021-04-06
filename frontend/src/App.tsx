import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import LoginScreen from "./components/screens/login/login"
import SignUpScreen from "./components/screens/signup/signup";
import HomeScreen from "./components/screens/home/home";
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/login">
            <LoginScreen />
          </Route>
          <Route path="/signup">
            <SignUpScreen />
          </Route>
          <Route path="/">
            <HomeScreen />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
