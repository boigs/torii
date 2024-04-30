import { render } from '@testing-library/react';

import PlayerDomain from 'src/domain/player';

import Player from '../Player';

describe('Player component...', () => {
  const player = new PlayerDomain('any-nickname', false, true);
  const disconnectedPlayer = new PlayerDomain('any-nickname', false, false);

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
