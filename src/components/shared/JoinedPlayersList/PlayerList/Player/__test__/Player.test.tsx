import { render } from '@testing-library/react';

import Player from 'src/domain/player';

import PlayerComponent from '../Player';

describe('Player component...', () => {
  const player: Player = {
    nickname: 'any-nickname',
    isHost: false,
    isConnected: true,
  };
  const disconnectedPlayer: Player = {
    nickname: 'any-nickname',
    isHost: false,
    isConnected: false,
  };

  it("should render the player's nickname", () => {
    const { container } = render(<PlayerComponent player={player} />);

    const nicknameParagraph = container.querySelector('p');

    expect(nicknameParagraph).toBeVisible();
  });

  it('should apply disconnected class when the player is disconnected', () => {
    const { container } = render(
      <PlayerComponent player={disconnectedPlayer} />,
    );

    const playerDiv = container.querySelector('div');

    expect(playerDiv?.className).toMatch(/disconnected/);
  });
});
