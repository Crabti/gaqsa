import { User } from '@types';
import React from 'react';

export interface AuthContextType {
  user: User;
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const AuthContext = React.createContext<AuthContextType>(undefined!);

// function parseJwt (token) {
//   var base64Url = token.split('.')[1];
//   var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//   var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
//       return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//   }).join(''));

//   return JSON.parse(jsonPayload);
// };
