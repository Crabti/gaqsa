import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, DefaultTheme } from 'styled-components';
import { BackendProvider } from 'integrations';
import { NavContextProvider } from 'hooks/navigation';
import { AuthContextProvider } from 'hooks/useAuth';
import { ShoppingCartContextProvider } from 'hooks/shoppingCart';
import App from './views/App';
import 'antd/dist/antd.css';

const globalTheme: DefaultTheme = {
  colors: {
    primary: '#003366',
    accent: '#0199cc',
    bgContent: '#f9f9f9',
    secondaryAccent: '#870f1e',
    background: '#f4f3f3',
    fontBase: '#333333',
  },
};

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <BrowserRouter>
        <BackendProvider>
          <NavContextProvider>
            <ShoppingCartContextProvider>
              <ThemeProvider theme={globalTheme}>
                <App />
              </ThemeProvider>
            </ShoppingCartContextProvider>
          </NavContextProvider>
        </BackendProvider>
      </BrowserRouter>
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
