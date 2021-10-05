import NotFound from 'components/NotFound';
import React from 'react';
import { Route, Switch } from 'react-router';
import { RegisteredGroup, RoutesType } from 'Routes';
import PrivateRoute from './PrivateRoute';

const RoutesComponents: React.FC<{groups: RegisteredGroup}> = ({ groups }) => (
  <Switch>
    {Object.values(groups).map(
      (group) => (
        Object.values(group.routes).map(
          (route) => {
            const {
              path, view: View, props, verboseName, isPublic,
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
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...props}
                />
              );
            }
            return (
              <PrivateRoute
                key={path}
                path={path}
                component={() => (
                  <View
                    verboseName={verboseName}
                    parentName={group.verboseName || 'Gaqsa'}
                  />
                )}
                exact
                  // eslint-disable-next-line react/jsx-props-no-spreading
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
