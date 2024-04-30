import { render } from '@testing-library/react';

import PlayerDomain from 'src/domain/player';

import Player from '../Player';

describe('Player component...', () => {
  const player = {
    nickname: 'any-nickname',
    isHost: false,
    isConnected: true,
  } as PlayerDomain;
  const disconnectedPlayer = {
    nickname: 'any-nickname',
    isHost: false,
    isConnected: true,
  } as PlayerDomain;

  it("should render the player's nickname", () => {
    const { container } = render(<Player player={player} />);

    const nicknameParagraph = container.querySelector('p');

    expect(nicknameParagraph).toBeVisible();
  });

  it('should apply disconnected class when the player is disconnected', () => {
    const { container } = render(<Player player={disconnectedPlayer} />);

    const playerDiv = container.querySelector('div');

    expect(playerDiv?.className).toMatch(/disconnected/);
  });
});
