import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../../src/App';

describe('App', () => {
  it('starts in idle and renders the mock weather after a successful search', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'O tempo da sua cidade, em um só lugar' }),
    ).toBeVisible();

    const searchbox = screen.getByRole('searchbox', { name: 'Buscar cidade' });
    await user.type(searchbox, 'São Paulo');
    await user.keyboard('{Enter}');

    expect(screen.getByRole('status')).toHaveTextContent('Buscando previsão para São Paulo');
    expect(searchbox).toHaveFocus();
    expect(await screen.findByText('22,4 °C')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Previsão' })).toBeVisible();
    expect(screen.getByText('Previsão carregada para São Paulo.')).toHaveAttribute(
      'aria-live',
      'polite',
    );
  });

  it('shows an empty state for a query that is not in the local mock', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Buscar cidade' }), 'Lisboa');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(
      await screen.findByRole('heading', { name: 'Nenhum dado encontrado para "Lisboa"' }),
    ).toBeVisible();
  });

  it('updates current and forecast temperatures when the unit changes', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Buscar cidade' }), 'São Paulo');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    await screen.findByText('22,4 °C');

    await user.click(screen.getByRole('button', { name: 'Fahrenheit' }));

    expect(screen.getByText('72,3 °F')).toBeVisible();
    expect(screen.getByText('Máx. 77,2 °F')).toBeVisible();
  });
});
