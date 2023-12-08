import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import JoinForm from '../JoinForm';

describe('JoinForm...', () => {
  it('should render both input fields when no props are passed', () => {
    render(<JoinForm />);

    const gameIdInput = screen.getByPlaceholderText('Game id');
    const nicknameInput = screen.getByPlaceholderText('Nickname');

    expect(gameIdInput).toBeVisible();
    expect(nicknameInput).toBeVisible();
  });

  it('should not show the game id input field when a game id is passed as prop', () => {
    render(<JoinForm gameId='any-id' />);

    const gameIdInput = screen.queryByPlaceholderText('Game id');

    expect(gameIdInput).not.toBeVisible();
  });

  it('should make the button not say "Join" when the component is loading', () => {
    render(<JoinForm loading={true} />);

    const joinButton = screen.getByRole('button');

    expect(joinButton.textContent).not.toBe('Join');
  });

  it('should call the callback function with the input of the user', async () => {
    const onSubmit = vi.fn();
    render(<JoinForm onSubmit={onSubmit} />);

    const gameIdInput = screen.getByPlaceholderText('Game id');
    const nicknameInput = screen.getByPlaceholderText('Nickname');
    const joinButton = screen.getByRole('button');

    await act(async () => {
      fireEvent.change(gameIdInput, { target: { value: 'any-id' } });
      fireEvent.change(nicknameInput, { target: { value: 'any-nickname' } });
      fireEvent.click(joinButton);
    });

    expect(onSubmit).toHaveBeenCalledWith({
      gameId: 'any-id',
      nickname: 'any-nickname',
    });
  });

  it('should call the callback function with the input of the user and the given game id as prop', async () => {
    const onSubmit = vi.fn();
    render(<JoinForm gameId='any-id' onSubmit={onSubmit} />);

    const nicknameInput = screen.getByPlaceholderText('Nickname');
    const joinButton = screen.getByRole('button');

    await act(async () => {
      fireEvent.change(nicknameInput, { target: { value: 'any-nickname' } });
      fireEvent.click(joinButton);
    });

    expect(onSubmit).toHaveBeenCalledWith({
      gameId: 'any-id',
      nickname: 'any-nickname',
    });
  });
});
