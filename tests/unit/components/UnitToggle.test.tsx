import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UnitToggle from '../../../src/components/UnitToggle';

describe('UnitToggle', () => {
  it('exposes a labeled group and pressed state for the selected unit', () => {
    render(<UnitToggle unit="celsius" onChange={vi.fn()} />);

    expect(screen.getByRole('group', { name: 'Unidade de temperatura' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Celsius' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Fahrenheit' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('changes the selected unit when a button is activated', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<UnitToggle unit="celsius" onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'Fahrenheit' }));

    expect(onChange).toHaveBeenCalledExactlyOnceWith('fahrenheit');
  });

  it('moves focus and changes unit with arrow keys', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<UnitToggle unit="celsius" onChange={onChange} />);

    const celsius = screen.getByRole('button', { name: 'Celsius' });
    const fahrenheit = screen.getByRole('button', { name: 'Fahrenheit' });
    celsius.focus();

    await user.keyboard('{ArrowRight}');

    expect(onChange).toHaveBeenLastCalledWith('fahrenheit');
    expect(fahrenheit).toHaveFocus();

    await user.keyboard('{ArrowLeft}');

    expect(onChange).toHaveBeenLastCalledWith('celsius');
    expect(celsius).toHaveFocus();
  });

  it('supports Home and End to focus the first and last unit', async () => {
    const user = userEvent.setup();
    render(<UnitToggle unit="celsius" onChange={vi.fn()} />);

    const celsius = screen.getByRole('button', { name: 'Celsius' });
    const fahrenheit = screen.getByRole('button', { name: 'Fahrenheit' });
    celsius.focus();

    await user.keyboard('{End}');
    expect(fahrenheit).toHaveFocus();

    await user.keyboard('{Home}');
    expect(celsius).toHaveFocus();
  });
});
