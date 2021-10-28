import { User } from '@types';
import React, { useState } from 'react';

export enum UserGroups {
  ADMIN = 'Administrador',
  CLIENT = 'Cliente',
  PROVIDER = 'Proveedor',
}

export interface AuthType {
  user?: User;
  access?: string;
  refresh?: string;
  expires?: number;
  isAdmin: boolean;
  isClient: boolean;
  isProvider: boolean;
}

export const INITIAL_AUTH_STATE: AuthType = {
  user: undefined,
  access: undefined,
  refresh: undefined,
  expires: undefined,
  isAdmin: false,
  isClient: false,
  isProvider: false,
};

export interface BooleanGroups {
  isAdmin: boolean;
  isClient: boolean;
  isProvider: boolean;
}

export const LOCAL_STORAGE_KEY = 'auth';

export type SetTokensFunc = (access: string, refresh: string) => void;
export type LogoutFunc = () => void;
export type GetGroups = (groups: string[]) => BooleanGroups;

export interface AuthContextType extends AuthType {
  setTokens: SetTokensFunc;
  logout: LogoutFunc;
}

export const AuthContext = React.createContext<AuthContextType>(
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  undefined!,
);

export const AuthContextProvider: React.FC = ({ children }) => {
  const retrieveState = (): AuthType => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (stored) {
      const parsedStored = JSON.parse(stored);
      return parsedStored;
    }
    return INITIAL_AUTH_STATE;
  };

  const [authState, setAuthState] = useState<AuthType>(retrieveState);

  const parseJwt = (token: string): any => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(
        (c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`,
      ).join(''),
    );

    return JSON.parse(jsonPayload);
  };

  const getGroups: GetGroups = (groups) => ({
    isAdmin: groups.includes(UserGroups.ADMIN),
    isClient: groups.includes(UserGroups.CLIENT),
    isProvider: groups.includes(UserGroups.PROVIDER),
  });

  const persistState = (newState: AuthType): void => {
    setAuthState(newState);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
  };

  const setTokens: SetTokensFunc = (access, refresh) => {
    const parsedToken = parseJwt(access);
    const groups = getGroups(parsedToken.groups);
    const newState: AuthType = {
      ...groups,
      access,
      refresh,
      expires: parsedToken.experies,
      user: {
        id: parsedToken.id,
        created_at: '',
        updated_at: '',
        email: '',
        first_name: parsedToken.first_name,
        last_name: parsedToken.last_name,
        groups: parsedToken.groups,
        username: parsedToken.username,
      },
    };
    persistState(newState);
  };

  const logout: LogoutFunc = () => {
    setAuthState(INITIAL_AUTH_STATE);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{
      ...authState, setTokens, logout,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextType => React.useContext(AuthContext);

export default useAuth;
