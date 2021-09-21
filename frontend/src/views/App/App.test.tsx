import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import MockedThemeProvider from 'components/Theme';
import App from './App';

test('renders content section', () => {
  render(
    <MemoryRouter>
      <MockedThemeProvider>
        <App />
      </MockedThemeProvider>
    </MemoryRouter>,
  );
  const content = screen.queryByTestId('content-container');
  expect(content).toBeInTheDocument();
});
