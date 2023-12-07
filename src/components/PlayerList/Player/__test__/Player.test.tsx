import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Player as PlayerType } from 'src/domain';

import Player from '../Player';

describe('Player component...', () => {
  const anyPlayer: PlayerType = {
    nickname: 'any-nickname',
    isHost: false,
    isConnected: true,
  };

  it("should render the player's nickname", () => {
    render(<Player player={anyPlayer} />);

    const nicknameText = screen.getByText(anyPlayer.nickname);

    expect(nicknameText).toBeVisible();
  });
});
