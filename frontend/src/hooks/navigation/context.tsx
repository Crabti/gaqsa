import React, { useState } from 'react';

export interface NavContextType {
  viewName: string;
  parentName?: string;
  setViewName: (newViewName: string) => void;
  setParentName: (newParentName?: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const NavContext = React.createContext<NavContextType>(undefined!);

export const NavContextProvider: React.FC = ({ children }) => {
  const [viewName, setViewNameHook] = useState('');
  const [parentName, setParentNameHook] = useState<string | undefined>('');

  const setViewName: NavContextType['setViewName'] = (newViewName) => {
    if (newViewName !== viewName) setViewNameHook(newViewName);
  };

  const setParentName: NavContextType['setParentName'] = (newParentName) => {
    if (newParentName !== parentName) setParentNameHook(newParentName);
  };

  return (
    <NavContext.Provider
      value={{
        viewName, parentName, setViewName, setParentName,
      }}
    >
      {children}
    </NavContext.Provider>
  );
};

export default NavContext;
