import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthProvider } from "../services/AuthContext";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Profile from "../pages/Profile";
import EditProfile from "../pages/EditProfile";
import NotFound from "../pages/NotFound";
import Favorites from "../pages/Favorites";
import Saved from "../pages/Saved";
import PaintingDetail from "../pages/PaintingDetail";

const Routes = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/profile" component={Profile} />
          <Route path="/editprofile" component={EditProfile} />
          <Route path="/favorites" component={Favorites} />
          <Route path="/saved" component={Saved} />
          <Route path="/painting/:id" element={<PaintingDetail />} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default Routes;
