import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmptyState from '../../../src/components/states/EmptyState';
import ErrorState from '../../../src/components/states/ErrorState';
import LoadingState from '../../../src/components/states/LoadingState';

describe('request state components', () => {
  it('announces loading content with status role', () => {
    render(<LoadingState message="Buscando cidades..." />);

    expect(screen.getByRole('status')).toHaveTextContent('Buscando cidades...');
  });

  it('announces an error and invokes retry from its button', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorState message="Não foi possível buscar cidades." onRetry={onRetry} />);

    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível buscar cidades.');
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));

    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('renders the empty-state title and hint', () => {
    render(<EmptyState title="Nenhuma cidade encontrada" hint="Tente outro nome." />);

    expect(screen.getByRole('status')).toHaveTextContent('Tente outro nome.');
    expect(screen.getByRole('heading', { name: 'Nenhuma cidade encontrada' })).toBeVisible();
    expect(screen.getByText('Tente outro nome.')).toBeVisible();
  });
});
