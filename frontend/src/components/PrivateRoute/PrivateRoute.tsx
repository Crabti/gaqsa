/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import useAuth from 'hooks/useAuth';
import { Redirect, Route, RouteProps } from 'react-router';
import { otherRoutes } from 'Routes';
import { Result } from 'antd';
import Props from './PrivateRoute.type';

const PrivateRoute: React.FC<RouteProps & Props> = ({
  component: Component, hasAccess, ...rest
}) => {
  const auth = useAuth();
  const { user } = auth;

  if (!Component) {
    return null;
  }

  return (
    <Route
      {...rest}
      render={(props) => {
        if (user === undefined) {
          return <Redirect to={{ pathname: otherRoutes.login.path }} />;
        }
        // Access not allowed
        if (hasAccess && !hasAccess(auth)) {
          return (
            <Result
              status="403"
              title="Acceso no autorizado (403)"
              subTitle="Lo sentimos, no cuenta con
              los permisos necesarios para acceder."
            />
          );
        }
        return <Component {...props} />;
      }}
    />
  );
};

export default PrivateRoute;
