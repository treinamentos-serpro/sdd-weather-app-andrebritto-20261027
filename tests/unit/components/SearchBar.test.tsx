import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../../../src/components/SearchBar';

describe('SearchBar', () => {
  it('exposes an accessible search landmark and labeled input', () => {
    render(<SearchBar onSearch={vi.fn()} />);

    expect(screen.getByRole('search', { name: 'Busca de cidades' })).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: 'Buscar cidade' })).toBeVisible();
  });

  it('does not search when the input is empty or only whitespace', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByRole('searchbox', { name: 'Buscar cidade' });
    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Digite o nome de uma cidade.');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    await user.type(input, '   ');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(onSearch).not.toHaveBeenCalled();
    expect(input).toHaveAccessibleDescription('Digite o nome de uma cidade.');
  });

  it('submits special characters as text and clears validation feedback', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    await user.type(screen.getByRole('searchbox'), "São Tomé & Príncipe + d'Oeste?");
    await user.keyboard('{Enter}');

    expect(onSearch).toHaveBeenCalledExactlyOnceWith("São Tomé & Príncipe + d'Oeste?");
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('searchbox')).not.toHaveAttribute('aria-invalid');
  });

  it.each([
    'São Paulo',
    '  São Paulo  ',
  ])('searches with the trimmed city name for %j', async (term) => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    await user.type(screen.getByLabelText('Buscar cidade'), term);
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(onSearch).toHaveBeenCalledExactlyOnceWith('São Paulo');
  });

  it('disables the input and submit button when disabled', () => {
    render(<SearchBar onSearch={vi.fn()} disabled />);

    expect(screen.getByRole('searchbox', { name: 'Buscar cidade' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Buscar' })).toBeDisabled();
  });
});
