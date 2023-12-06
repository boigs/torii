import React from 'react';

import { render, screen } from '@testing-library/react';

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
});
