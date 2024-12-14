import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthProvider } from "../services/AuthContext";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";

const Routes = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/profile" component={Profile} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default Routes;
