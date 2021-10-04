import { useHistory } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import ProtectedRoute from "./auth/protected-route";
import { Switch } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/dashboard/dashboard";
import Details from "./components/details/details";
import NavBar from "./components/navbar/NavBar";
import React from "react";
export const serverUrl = process.env.REACT_APP_SERVER_URL;

function App() {
  const { isAuthenticated } = useAuth0();
  const history = useHistory();
  React.useEffect(() => {
    if (isAuthenticated) {
      history.push({
        pathname: `/dashboard`,
      });
    }
  });
  return (
    <div className="App">
      <NavBar />
      <Switch>
        <ProtectedRoute
          path="/detials/:filename/:type"
          exact
          component={Details}
        />
        <ProtectedRoute path="/dashboard" exact component={Dashboard} />
      </Switch>
    </div>
  );
}

export default App;
