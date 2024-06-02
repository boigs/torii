import Player from './player';

interface VotingItem {
  readonly player: Player;
  readonly word: string;
  readonly rejectedMatches: Map<Player, Set<string>>;
}

export default VotingItem;
