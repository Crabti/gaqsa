/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useMemo, useState } from 'react';
import useAuth from 'hooks/useAuth';
import { Redirect, Route, RouteProps } from 'react-router';
import { otherRoutes } from 'Routes';

const PrivateRoute: React.FC<RouteProps> = ({
  component: Component, ...rest
}) => {
  const { user } = useAuth();
  const [isLoggedIn, setLoggedIn] = useState(true);

  const isAuthenticated: boolean = useMemo(() => (
    user !== undefined
  ), [user]);

  useEffect(() => {
    setLoggedIn(!user);
  }, [user]);

  if (!Component || isLoggedIn) {
    return null;
  }
  return (
    <Route
      {...rest}
      render={(props) => (isAuthenticated
        ? <Component {...props} />
        : <Redirect to={{ pathname: otherRoutes.login.path }} />)}
    />
  );
};

export default PrivateRoute;
