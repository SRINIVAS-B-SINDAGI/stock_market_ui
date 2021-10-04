// src/auth/protected-route.js

import React from "react";
import { Route } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import { CircularProgress } from "@mui/material";

const ProtectedRoute = ({ component, ...args }) => (
  <Route
    component={withAuthenticationRequired(component, {
      onRedirecting: () => <CircularProgress />,
      returnTo: window.location.origin,
    })}
    {...args}
  />
);

export default ProtectedRoute;
