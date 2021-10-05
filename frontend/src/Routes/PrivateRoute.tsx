/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import useAuth from 'hooks/useAuth';
import { Redirect, Route, RouteProps } from 'react-router';
import { otherRoutes } from 'Routes';

const PrivateRoute: React.FC<RouteProps> = ({
  component: Component, ...rest
}) => {
  const { user } = useAuth();

  if (!Component) {
    return null;
  }

  return (
    <Route
      {...rest}
      render={(props) => (user !== undefined
        ? <Component {...props} />
        : <Redirect to={{ pathname: otherRoutes.login.path }} />)}
    />
  );
};

export default PrivateRoute;
