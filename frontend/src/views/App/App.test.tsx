import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import MockedThemeProvider from 'components/Theme';
import { NavContextProvider } from 'hooks/navigation';
import App from './App';

test('renders content section', () => {
  render(
    <MemoryRouter>
      <MockedThemeProvider>
        <NavContextProvider>
          <App />
        </NavContextProvider>
      </MockedThemeProvider>
    </MemoryRouter>,
  );
  const content = screen.queryByTestId('content-container');
  expect(content).toBeInTheDocument();
});
