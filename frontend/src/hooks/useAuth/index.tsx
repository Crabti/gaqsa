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
