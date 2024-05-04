import Player from './player';

interface VotingItem {
  readonly player: Player;
  readonly word: string;
}

export default VotingItem;
