import React from 'react';
import { DefaultTheme, ThemeProvider } from 'styled-components';

const MockedThemeProvider: React.FC = ({ children }) => {
  const theme: DefaultTheme = {
    colors: {
      background: '#000',
      accent: '#000',
      bgContent: '#000',
      fontBase: '#000',
      primary: '#000',
      secondaryAccent: '#000',
    },
  };

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default MockedThemeProvider;
