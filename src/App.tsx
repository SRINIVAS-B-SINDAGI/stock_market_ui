import { useAuth0 } from "@auth0/auth0-react";
import { Switch, Route, Redirect } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/dashboard/dashboard";
import Details from "./components/details/details";
import NavBar from "./components/navbar/NavBar";
import UnAuthorized from "./components/unauthorized/UnAuthorized";
export const serverUrl = process.env.REACT_APP_SERVER_URL;

function App() {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="App">
      <NavBar />
      {isAuthenticated ? (
        <Switch>
          <Route path="/detials/:filename/:type" exact component={Details} />
          <Route path="/dashboard" exact component={Dashboard} />
          <Route path="/" render={() => <Redirect to="/dashboard" />} />
        </Switch>
      ) : (
        <Switch>
          <Route path="/" exact component={UnAuthorized} />
          <Route render={() => <Redirect to="/" />} />
        </Switch>
      )}
    </div>
  );
}

export default App;
