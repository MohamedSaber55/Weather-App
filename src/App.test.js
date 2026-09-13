import { render, screen } from '@testing-library/react';
import App from './App';
import { SettingsProvider } from './context/SettingsContext';
import { FavoritesProvider } from './context/FavoritesContext';

function renderApp() {
  return render(
    <SettingsProvider>
      <FavoritesProvider>
        <App />
      </FavoritesProvider>
    </SettingsProvider>
  );
}

test('renders the app shell with a searchable location bar', () => {
  renderApp();
  expect(screen.getByLabelText(/search for a city/i)).toBeInTheDocument();
});