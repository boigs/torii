import { render } from '@testing-library/react';

import { Player as PlayerType } from 'src/domain';

import Player from '../Player';

describe('Player component...', () => {
  const anyPlayer: PlayerType = {
    nickname: 'any-nickname',
    isHost: false,
    isConnected: true,
  };

  it("should render the player's nickname", () => {
    const { container } = render(<Player player={anyPlayer} />);

    const nicknameParagraph = container.querySelector('p');

    expect(nicknameParagraph).toBeVisible();
  });

  it('should apply disconnected class when the player is disconnected', () => {
    const { container } = render(
      <Player player={{ ...anyPlayer, isConnected: false }} />
    );

    const playerDiv = container.querySelector('div');

    expect(playerDiv?.className).toMatch(/disconnected/);
  });
});
