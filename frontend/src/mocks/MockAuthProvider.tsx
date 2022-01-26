import { AuthContext, AuthType } from 'hooks/useAuth';
import React from 'react';

const MOCK_INITIAL_STATE : AuthType = {
  user: {
    id: 0,
    created_at: '',
    updated_at: '',
    email: '',
    first_name: '',
    last_name: '',
    groups: [''],
    username: '',
  },
  access: undefined,
  refresh: undefined,
  expires: undefined,
  isAdmin: false,
  isClient: false,
  isProvider: false,
  isInvoiceManager: false,
};

const mockSetTokens = jest.fn();
const mockLogout = jest.fn();
const MockAuthProvider: React.FC = ({ children }) => (
  <AuthContext.Provider value={{
    ...MOCK_INITIAL_STATE,
    logout: mockLogout,
    setTokens: mockSetTokens,
  }}
  >
    {children}
  </AuthContext.Provider>
);

export default MockAuthProvider;
