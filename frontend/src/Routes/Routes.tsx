/* eslint-disable react/jsx-props-no-spreading */
import NotFound from 'components/NotFound';
import PrivateRoute from 'components/PrivateRoute';
import React from 'react';
import { Route, Switch } from 'react-router';
import { RegisteredGroup, RoutesType } from 'Routes';

const RoutesComponents: React.FC<{groups: RegisteredGroup}> = ({ groups }) => (
  <Switch>
    {Object.values(groups).map(
      (group) => (
        Object.values(group.routes).map(
          (route) => {
            const {
              path, view: View,
              props, verboseName, isPublic,
              hasAccess,
            }: RoutesType = route;

            if (isPublic) {
              return (
                <Route
                  key={path}
                  path={path}
                  component={() => (
                    <View
                      verboseName={verboseName}
                      parentName={group.verboseName || 'Gaqsa'}
                    />
                  )}
                  exact
                  {...props}
                />
              );
            }
            return (
              <PrivateRoute
                key={path}
                path={path}
                hasAccess={hasAccess}
                component={() => (
                  <View
                    verboseName={verboseName}
                    parentName={group.verboseName || 'Gaqsa'}
                  />
                )}
                exact
                {...props}
              />
            );
          },
        )
      ),
    )}
    <Route component={NotFound} />
  </Switch>
);

export default RoutesComponents;
