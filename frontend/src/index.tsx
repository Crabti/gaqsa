import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, DefaultTheme } from 'styled-components';
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
    <BrowserRouter>
      <ThemeProvider theme={globalTheme}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);
