import React from 'react';
import { Route } from 'react-router';
import { RegisteredGroup, RoutesType } from 'Routes';

const RoutesComponents: React.FC<{groups: RegisteredGroup}> = ({ groups }) => (
  <>
    {Object.values(groups).map(
      (group) => (
        Object.values(group.routes).map(
          (route) => {
            const {
              path, view: View, props, verboseName,
            }: RoutesType = route;

            return (
              <Route
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
  </>
);

export default RoutesComponents;
